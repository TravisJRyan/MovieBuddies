const express = require("express"); // Express module for creating a server to route pages
const app = express(); // init Express server as a variable
const session = require('express-session'); // Manages session variables
const request = require('request'); // HTTP request module
const fs = require('fs'); // file system
const bcrypt = require('bcrypt'); // used for hashing passwords
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

// Do not cache pages
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

// POST operation for logging in
app.post("/login", function (req, res) {
    if (req.session.email) // if already logged in, do not perform operation
        res.redirect("/");
    else {
        accountHelper.authenticate(req.body.email, req.body.password, function (results) {
            if (results == '404' || results.length == 0) {
                res.redirect("/login?loginFailure=true");
            }
            else { // successful login
                req.session.email = req.body.email; // set login for session
                res.redirect("/userPage?email=" + req.session.email); // redirect to dashboard
            }
        });
    }
});

// POST operation for registering
app.post("/register", function (req, res) {
    if (req.session.email) // if already logged in, do not perform operation
        res.redirect("/");
    else if (req.body.first && req.body.last && req.body.email && req.body.password) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            accountHelper.createAccount(req.body.first, req.body.last, req.body.email, hash, function (result) {
                if (result) {
                    req.session.email = req.body.email;
                    res.redirect("/userPage?email=" + req.session.email);
                } else {
                    res.send("Failed to register.");
                }
            });
        })
    } else {
        res.send("Please supply all fields for registration")
    }
});

// POST operation for settings update
app.post('/updatesettings', function(req, res){
    validateLoggedIn(req, res, function(){
        console.log(req.body);
        accountHelper.updateSettings(req.session.email,req.body, function(results){
            res.redirect("/userPage?email="+req.session.email);
        });
    });
});

// operation for logging out
app.get("/logout", function(req, res) {
    req.session.destroy(); // destroy session
    res.redirect("/"); // redirect to login page
});

// Login page
app.get("/login", function(req, res) {
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

app.get("/acceptRequest", function (req, res) {
    validateLoggedIn(req, res, function () {
        if (!req.query.sender || !req.query.receiver || (req.query.receiver != req.session.email))
            res.redirect("/404");
        else {
            accountHelper.addFriendship(req.query.sender, req.query.receiver, function () {
                res.redirect("/friendrequests");
            });
        }
    });
});

app.get("/rejectRequest", function (req, res) {
    validateLoggedIn(req, res, function () {
        if (!req.query.sender || !req.query.receiver || (req.query.receiver != req.session.email))
            res.redirect("/404");
        else {
            accountHelper.declineFriendship(req.query.sender, req.query.receiver, function () {
                res.redirect("/friendrequests");
            });
        }
    });
});

app.get("/moviesrated", function (req, res) {
    validateLoggedIn(req, res, function () {
        dataHelper.getRatings(req.session.email, function (results) {
            movieIDs = [];
            for (var i = 0; i < results.length; i++) {
                movieIDs.push(results[i]["movieID"]);
            }
            getMovieData(movieIDs, function (dataResult) {
                res.render("moviesrated", {
                    movieData: dataResult,
                    ratings: results
                });
            });
        });
    });
});

// Route for home page
app.get("/", function (req, res) {
    if (!req.session.email)
        res.redirect("login");
    else
        res.redirect("userPage?email=" + req.session.email);
});

app.get("/userLookup", function(req, res){
    validateLoggedIn(req, res, function () {
        if(req.query.searchEmail){
            
        }
    });
});

// Search results page
app.get("/search", function (req, res) {
    validateLoggedIn(req, res, function () {
        if (req.query.searchTerm) {
            request('https://www.omdbapi.com/?s=' + req.query.searchTerm + '&apikey=b09eb4ff', function (error, response, body) {
                res.render("search", {
                    searchTerm: req.query.searchTerm,
                    searchResults: JSON.parse(body)["Search"]
                });
            });
        } else {
            res.send("Please provide a search term.");
        }
    });
});

app.get("/addfriend", function (req, res) {
    validateLoggedIn(req, res, function () {
        if (req.query.receiver && req.session.email == req.query.sender) {
            accountHelper.newFriendRequest(req.query.sender, req.query.receiver, function (results) {
                res.redirect("/userPage?email=" + req.query.receiver);
            });
        } else {
            res.redirect("/404");
        }
    });
});

// Movie page
app.get("/movie", function (req, res) {
    validateLoggedIn(req, res, function () {
        if (req.query.id) {
            dataHelper.getRating(req.session.email, req.query.id, function (existingRating) { // check if user has already rated
                if (existingRating == -1)
                    res.send("There was an error receiving the user's ratings.")
                else {
                    existingRating = existingRating;
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
    validateLoggedIn(req, res, function () {
        accountHelper.getuser(req.session.email, function(results){
            res.render("settings"); // TODO

        });
    });
});

// User settings page
app.get("/userSearch", function (req, res) {
    validateLoggedIn(req, res, function () {
        res.render("userSearch"); // TODO
    });
});

// About Us page
app.get("/about", function (req, res) {
    validateLoggedIn(req, res, function () {
        res.render("about");
    });
});

// Browse friend requests page
app.get("/friendrequests", function (req, res) {
    validateLoggedIn(req, res, function () {
        accountHelper.getPendingRequests(req.session.email, function (results) {
            res.render("friendrequests", {
                friendRequests: results,
                userEmail: req.session.email
            });
        });
    });
});

// Movie recommendation page
app.get("/recommend", function (req, res) {
    validateLoggedIn(req, res, function () {
        res.render("recommend");
    });
});

// Route for voting on a movie, then redirects to the movie's page
app.get("/rateMovie", function (req, res) {
    validateLoggedIn(req, res, function () {
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
});

// 404 Page Not Found page
app.get("/404", function (req, res) {
    res.render("404");
});

// Route to view all friends
app.get("/friends", function (req, res) {
    validateLoggedIn(req, res, function () {
        accountHelper.getFriends(req.session.email, function (results) {
            res.render("friends", {
                friends: results,
                userEmail: req.session.email
            });
        });
    });
});

//Route to userPage
app.get("/userPage", function (req, res) {
    validateLoggedIn(req, res, function () {
        if (!req.query.email) {
            res.redirect("/404");
        } else {
            dataHelper.getRecentRatings(req.query.email, function (results) {
                accountHelper.validateUserExists(req.query.email, function (userExistsResults) {
                    accountHelper.isFriend(req.query.email, req.session.email, function (isFriend) {
                        accountHelper.getUser(req.query.email, function (userData) {
                            var friendshipExists = isFriend;
                            if (userExistsResults == false)
                                res.redirect("/404"); // user does not exist
                            else { // user exists
                                if (results == -1) // SQL error
                                    res.send("An error occurred gathering user ratings.");
                                else if (results.length == 0) { // TODO : make it impossible to visit nonexistant user's pages
                                    res.render("userPage", {
                                        movies: [],
                                        email: req.query.email,
                                        friendshipExists: friendshipExists,
                                        userEmail: req.session.email,
                                        userData: userData
                                    });
                                }
                                else {
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
                                                movies.sort(function (a, b) { return a[4] < b[4] });
                                                res.render("userPage", {
                                                    movies: movies, // render page with movies data
                                                    email: req.query.email,
                                                    friendshipExists: friendshipExists,
                                                    userEmail: req.session.email,
                                                    userData: userData
                                                });
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    });
                });
            });
        }
    });
});

// Function takes an array of movie IDs and returns JSON mapping those IDs to movie data (title, poster, etc)
function getMovieData(movieIDs, callback) {
    results = {};
    completedRequests = 0;
    let movieData = JSON.parse(fs.readFileSync('ML/movieData.json', 'utf8'));
    for (var i = 0; i < movieIDs.length; i++) {
        currentMovieID = movieIDs[i];
        if (movieData.hasOwnProperty(currentMovieID)) { // movie data is in local JSON
            results[currentMovieID] = movieData[currentMovieID];
            completedRequests++;
            if (completedRequests == movieIDs.length)
                callback(results);
        } else { // data is not in local file date
            request('https://www.omdbapi.com/?i=' + currentMovieID + '&apikey=b09eb4ff', function (error, response, body) {
                if (error)
                    console.log(error);
                results[currentMovieID] = JSON.parse(body);
                completedRequests++;
                if (completedRequests == movieIDs.length)
                    callback(results);
            });
        }
    }
}


//TEST FUNCTION FOR RECOMMENDATIONS *******REMOVE LATE
app.get("/testrec", function(req, res){

    dataHelper.recommend("mary@mary.com", function (dataResult) {
        console.log("testrec result:")
        console.log(dataResult)
    });
    res.redirect("/404");

})

// Redirect unknown routes to 404 page
app.get("/*", function (req, res) {
    res.redirect("/404");
});

// Function validates session and redirects if not
function validateLoggedIn(req, res, callback) {
    if (!req.session.email) {
        res.redirect("/");
    } else {
        callback(true);
    }
}