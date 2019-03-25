const express = require("express"); // Express module for creating a server to route pages
const app = express(); // init Express server as a variable
const session = require('express-session'); // Manages session variables
const request = require('request'); // HTTP request module
const axios = require('axios'); // Used for Promises
const fs = require ('fs'); // file system
const mysql = require('mysql'); // MySQL
app.set("view engine", "pug"); // have the server use Pug to render pages

const secretVars = JSON.parse(fs.readFileSync('secret.json', 'utf8')); // import secret vars

// Connection Object for MySQL
const db = mysql.createConnection({
    host: secretVars["host"],
    user: secretVars["user"],
    password: secretVars["password"],
    database: secretVars["database"]
});

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
 
// POST operation for logging in
app.post("/login", function(req,res){
    accountHelper.validate(req.body.email, req.body.password, function(result){
        if(result){ // successful login
            req.session.email = req.body.email; // set login for session
            res.redirect("/"); // redirect to dashboard
        }
    });
});

// POST operation for logging out
app.post("/logout", function(req,res){
    req.session.destroy(); // destroy session
    res.redirect("/"); // redirect to login page
});

app.get("/anothertest", function(req, res){
    //hit API
    var title="aquaman";
    axios.get('https://www.omdbapi.com/?t='+title+'&apikey=b09eb4ff', function (error, response, body) {
        console.log(body);
        var image=JSON.parse(body)["Poster"];
        var title=JSON.parse(body)["Title"];
        res.render("userPage", {
            imagedata: image, 
            titledata: title
        });
    });
});

// Route for home page
app.get("/", function(req, res){
    if(!req.session.email)
        res.render("login");
    else
        res.render("dashboard",{
            userEmail : req.session.email
        });
});

// Search results page
app.get("/search", function(req,res){
    if(req.query.searchTerm){
        request('https://www.omdbapi.com/?s='+req.query.searchTerm+'&apikey=b09eb4ff', function(error,response,body){
            res.render("search", {
                searchTerm : req.query.searchTerm,
                searchResults: JSON.parse(body)["Search"]
            });
        });
    } else{
        res.send("Please provide a search term.")
    }
    
});

// Movie page
app.get("/movie", function(req,res){
    if(req.query.id){
        var movieId = req.query.id;
        let movieData = JSON.parse(fs.readFileSync('ML/movieData.json', 'utf8'));
        if(movieData.hasOwnProperty(movieId)){
            var dataBlock = movieData[movieId];
            res.render("movie", {
                movie : dataBlock
            });
        } else {
            request('https://www.omdbapi.com/?i='+movieId+'&apikey=b09eb4ff', function(error,response, body){
                if(JSON.parse(body)["Response"]=="False")
                    res.send("No movie was found for that ID.");
                else{
                    res.render("movie",{
                        movie: JSON.parse(body)
                    });
                }
            });
        }
    } else {
        res.send("Please supply a movie ID");
    }
});

// User account page
app.get("/user", function(req,res){
    res.render("user"); // TODO
});

// User settings page
app.get("/settings", function(req,res){
    res.render("settings"); // TODO
});

// About Us page
app.get("/about", function(req,res){
    res.render("about");
});

// Browse friend requests page
app.get("/friendrequests", function(req,res){
    var friendRequests = ["travis@gmail.com", "terry@gmail.com", "mary@gmail.com"];
    res.render("friendrequests",{
        friendRequests: friendRequests
    });
});

// Movie recommendation page
app.get("/recommend", function(req,res){
    res.render("recommend"); // TODO
});

// 404 Page Not Found page
app.get("/404", function(req,res){
    res.render("404");
});

//Route to userPage
app.get("/userPage", function(req, res){
    var titles = ["aquaman", "glass", "shrek", "batman", "captain america"];
    var requestNumber = titles.length;
    var requestComplete = 0;
    var movies = []; // an array of length-2 arrays
    for(let i = 0; i < requestNumber; i++){
        request('https://www.omdbapi.com/?t='+titles[i]+'&apikey=b09eb4ff', function(error,response, body){
            requestComplete++;
            var image = JSON.parse(body)["Poster"];
            var title = JSON.parse(body)["Title"];
            var id = JSON.parse(body)["imdbID"];
            console.log(id);
            var movie = [image, title, id];
            movies.push(movie); // push image/title (length 2 array) to movies array
            if(requestComplete == requestNumber){ // all requests complete
                res.render("userPage",{
                    movies : movies // render page with movies data
                });
            }
        });
    } 
});

// Redirect unknown routes to 404 page
app.get("/*", function(req, res){
    res.redirect("/404");
});