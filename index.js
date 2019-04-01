const express = require("express"); // Express module for creating a server to route pages
const app = express(); // init Express server as a variable
const session = require('express-session'); // Manages session variables
const request = require('request'); // HTTP request module
const fs = require('fs'); // file system
const bodyParser = require('body-parser'); // for receving POST bodies
app.set("view engine", "pug"); // have the server use Pug to render pages

// Read local secret vars (Git ignored)
const secretVars = JSON.parse(fs.readFileSync('secret.json', 'utf8')); // import secret vars

// Helper Classes
const accountHelper = require("./helperClasses/accountHelper");
const dataHelper = require("./helperClasses/dataHelper");

//Start server listening at port 3000 (localhost:3000)
app.listen("3000", () => {
    console.log("Server started on port 3000...");
});

// Allow the server to access static files in the same directory
app.use(express.static(__dirname));

// Init session configurations for server
app.use(
    session({
        secret: "dnasdnsajkdnjksandkjsandjksadn", // session secret
        key: "asdjbsjhdbnsjandbjshabdjhsabdjhbsadjh", // session key
        resave: false, // don't resave session data
        saveUninitialized: true, // save uninitialized session data
        cookie: { // cookie settings
            httpOnly: false, // allow other than HTTP
            expires: new Date(Date.now() + 60 * 60 * 1000) // cookie expiration date
        }
    })
);

// Use Body Parser module for POST operation response blocks
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// POST operation for logging in
app.post("/login", function (req, res) {
    if (req.session.email) // if already logged in, do not perform operation
        res.redirect("/");
    else {
        accountHelper.authenticate(req.body.email, req.body.password, function (results) {
            if (results.length == 0) {
                res.redirect("/login?loginFailure=true");
            }
            else { // successful login
                req.session.email = req.body.email; // set login for session
                res.redirect("/userPage"); // redirect to dashboard
            }
        });
    }
});

// POST operation for registering
app.post("/register", function (req, res) {
    if (req.session.email) // if already logged in, do not perform operation
        res.redirect("/");
    else if (req.body.first && req.body.last && req.body.email && req.body.password) {
        accountHelper.createAccount(req.body.first, req.body.last, req.body.email, req.body.password, function (result) {
            if (result) {
                req.session.email = req.body.email;
                res.redirect("/userPage");
            } else {
                res.send("Failed to register.");
            }
        });
    } else {
        res.send("Please supply all fields for registration")
    }
});

// operation for logging out
app.get("/logout", function (req, res) {
    req.session.destroy(); // destroy session
    res.redirect("/"); // redirect to login page
});

// Login page
app.get("/login", function (req, res) {
    if (req.session.username)
        res.redirect("/");
    else if (req.query.loginFailure && req.query.loginFailure == "true") {
        res.render("login", {
            loginFailure: true
        });
    } else {
        res.render("login", {
            loginFailure: false
        });
    }
});

// Dashboard page
app.get("/dashboard", function(req, res){
    //validateLoggedIn(req, res, function(){
        res.render("dashboard");
    //});
});

// Route for home page
app.get("/", function (req, res) {
    if (!req.session.email)
        res.redirect("login");
    else
        res.redirect("userPage");
});

// Search results page
app.get("/search", function (req, res) {
    //validateLoggedIn(req, res, function(){
    if (req.query.searchTerm) {
        request('https://www.omdbapi.com/?s=' + req.query.searchTerm + '&apikey=b09eb4ff', function (error, response, body) {
            res.render("search", {
                searchTerm: req.query.searchTerm,
                searchResults: JSON.parse(body)["Search"]
            });
        });
    } else {
        res.send("Please provide a search term.")
    }
    //});
});

// Movie page
app.get("/movie", function (req, res) {
    validateLoggedIn(req, res, function(){
        if (req.query.id) {
            dataHelper.getRatings(req.session.email, req.query.id, function (existingRating){ // check if user has already rated
                if(existingRating==-1)
                    res.send("There was an error receiving the user's ratings.")
                else{
                    existingRating=existingRating;
                    var movieId = req.query.id;
                    let movieData = JSON.parse(fs.readFileSync('ML/movieData.json', 'utf8'));
                    if (movieData.hasOwnProperty(movieId)) { // movie data is in local JSON
                        var dataBlock = movieData[movieId];
                        res.render("movie", {
                            movie: dataBlock,
                            movieID: req.query.id,
                            defaultFilledStars: existingRating
                        });
                    } else { // movie data is not in local JSON, hit API
                        request('https://www.omdbapi.com/?i=' + movieId + '&apikey=b09eb4ff', function (error, response, body) {
                            if (JSON.parse(body)["Response"] == "False")
                                res.send("No movie was found for that ID.");
                            else {
                                res.render("movie", {
                                    movie: JSON.parse(body),
                                    movieID: req.query.id,
                                    defaultFilledStars: existingRating
                                });
                            }
                        });
                    }
                }
            });
        } else {
            res.send("Please supply a movie ID");
        }
    });
});

// User settings page
app.get("/settings", function (req, res) {
    //validateLoggedIn(req, res, function(){
    res.render("settings"); // TODO
    //});
});

// About Us page
app.get("/about", function (req, res) {
    //validateLoggedIn(req, res, function(){
    res.render("about");
    //});
});

// Browse friend requests page
app.get("/friendrequests", function (req, res) {
    //validateLoggedIn(req, res, function(){
    var friendRequests = ["travis@gmail.com", "terry@gmail.com", "mary@gmail.com"];
    res.render("friendrequests", {
        friendRequests: friendRequests
    });
    //});
});

// Movie recommendation page
app.get("/recommend", function (req, res) {
    //validateLoggedIn(req, res, function(){
    res.render("recommend");
    //});
});

// Route for voting on a movie, then redirects to the movie's page
app.get("/rateMovie", function (req, res) {
    if (req.session.email && req.query.rating && req.query.movieId) {
        dataHelper.addRating(req.session.email, req.query.movieId, req.query.rating, function (result) {
            if (!result)
                res.send("There was an error rating the movie.");
            else {
                res.redirect("/movie?id=" + req.query.movieId);
            }
        });
    } else {
        res.redirect("/");
    }
});

// 404 Page Not Found page
app.get("/404", function (req, res) {
    res.render("404");
});

//Route to userPage
app.get("/userPage", function (req, res) {
    validateLoggedIn(req, res, function(){
        dataHelper.getRecentRatings(req.session.email, function(results){
            if(results==-1)
                res.send("An error occurred gathering user ratings.");
            else if(results.length==0){
                res.render("userPage", {
                    movies: []
                });
            }
            else{
                var requestNumber = results.length;
                var requestComplete = 0;
                var movies = []; // an array of length-3 arrays (image/title/rating)
                for (let i = 0; i < results.length; i++) {
                    request('https://www.omdbapi.com/?i=' + results[i]["movieID"] + '&apikey=b09eb4ff', function (error, response, body) {
                        requestComplete++;
                        var image = JSON.parse(body)["Poster"];
                        var title = JSON.parse(body)["Title"];
                        var id = JSON.parse(body)["imdbID"];
                        var movie = [image, title, id, results[i]["rating"], results[i]["datetime"]];
                        movies.push(movie); // push image/title/rating (length 3 array) to movies array
                        if (requestComplete == requestNumber) { // all requests complete
                            movies.sort(function(a,b){return a[4] < b[4]});
                            res.render("userPage", {
                                movies: movies // render page with movies data
                            });
                        }
                    });
                }
            }
        });
    });
});

// Redirect unknown routes to 404 page
app.get("/*", function (req, res) {
    res.redirect("/404");
});

function validateLoggedIn(req, res, callback) {
    if (!req.session.email) {
        res.redirect("/");
    } else {
        callback(true);
    }
}