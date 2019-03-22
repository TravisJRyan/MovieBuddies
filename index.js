const express = require("express"); // Express module for creating a server to route pages
const app = express(); // init Express server as a variable
const session = require('express-session'); // Manages session variables
const request = require('request'); // HTTP request module
const axios = require('axios'); // Used for Promises
const fs = require ('fs'); // file system
const mysql = require('mysql'); // MySQL
app.set("view engine", "pug"); // have the server use Pug to render pages

/*const secretVars = JSON.parse(fs.readFileSync('secret.json', 'utf8')); // import secret vars

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

// Start server listening at port 3000 (localhost:3000)
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
    if(accountHelper.validate(req.body.email, req.body.password)){
        req.session.email=req.body.email; // log in with session data
        res.redirect("/"); // redirect to landing page
    } else{
        res.redirect("/"); // failure logging in, refresh without login
    }
});

// POST operation for logging out
app.post("/logout", function(req,res){
    req.session.destroy(); // destroy session
    res.redirect("/"); // redirect to login page
});

// Route for the home page
app.get("/mystuff", function(req, res){
    // ask database for users ratings
    var databaseResult = accountHelper.getRatings("blablah@gmail.com");
    var userRatingsInfo = {};
    for(var i = 0; i < databaseResult.length; i++){
        var apiResult = ""; // hit api and get movie title, photo, etc.
        userRatingsInfo.add(apiResult);
    }
    res.render("test", {
        myvar : databaseResult
    }); // Render the pug file "test"
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

/* ASYNCHRONOUS EXAMPLE
 app.get("/anothertest", function(req, res){
    //hit API
    var movieTitles = [1, 2, 3, 4, 5]
    var numberOfRequests = movieTitles.length;
    var requestsFinished = 0;
    var data = {};
    for(var i = 0; i < numberOfRequests; i++){
        request('https://www.omdbapi.com/?t='+title+'&apikey=b09eb4ff', function (error, response, body) {
            requestsFinished++;
            data += body;
            if(requestsFinished==numberOfRequests){
                res.render("userPage", {
                    data: data
                });
            }
        });
    }
    done = false;
}); */

// Route for home page
app.get("/", function(req, res){
    res.render("login"); // TODO
});

// Search results page
app.get("/search", function(req,res){
    res.render("search"); // TODO
});

// Movie page
app.get("/movie", function(req,res){
    res.render("movie"); // TODO
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
    res.render("about"); // TODO
});

// Browse friend requests page
app.get("/friendrequests", function(req,res){
    res.render("friendrequests"); // TODO
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
    var title="aquaman";
    request('https://www.omdbapi.com/?t='+title+'&apikey=b09eb4ff', function(error,response, body){
        var image = JSON.parse(body)["Poster"];
        var title = JSON.parse(body)["Title"];
        res.render("userPage",{
            imagedata: image,
            titledata: title
        });
    });  
});

// Redirect unknown routes to 404 page
app.get("/*", function(req, res){
    res.redirect("/404");
});

// Colors #3F0D12 #A71D31 #F2F1CD