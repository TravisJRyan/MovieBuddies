const express = require("express"); // Express module for creating a server to route pages
const app = express(); // init Express server as a variable
const session = require('express-session'); // Manages session variables
app.set("view engine", "pug"); // have the server use Pug to render pages

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
        req.session.username=req.body.email; // log in with session data
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
    databaseResult = ["one", "two", "three", "four"];
    res.render("test", {
        myvar : databaseResult
    }); // Render the pug file "test"
});

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

// Error page (404 page not found)
app.get("/404", function(req,res){
    res.render("404"); // TODO
});

//Route to userPage
app.get("/userPage", function(req, res){
    res.render("userPage");
});

// Redirect unknown routes to 404 page
app.get("/*", function(req, res){
    res.redirect("/404");
});


// Colors #3F0D12 #A71D31 #F2F1CD