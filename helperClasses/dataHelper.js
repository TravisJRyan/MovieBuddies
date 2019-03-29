const mysql = require('mysql'); // MySQL
const fs = require('fs'); // file system
const secretVars = JSON.parse(fs.readFileSync('secret.json', 'utf8')); // import secret vars

// Connection Object for MySQL
const DB = mysql.createConnection({
    host: secretVars["host"],
    user: secretVars["user"],
    password: secretVars["password"],
    database: secretVars["database"]
});

// TODO: function takes a user's email and returns a list of IMDB ID's for recommended movies by using ML
module.exports.recommend = function(email){
    return [];
}

// TODO: check if user has rated a function
module.exports.getRatings = function(){

}

// function processes a new movie rating for a user
// callbacks false if insert operation failed, true if success
// TODO: Need to add timestamps to ratings so we can sort them for user pages
module.exports.addRating = function(email, movieID, rating, callback){

    //exit if null values
    if (!email || !movieID || !rating)
        callback(false);
    
    //insert query
    let newRatingSQL = "INSERT INTO ratings (email, movieID, rating) VALUES('"+
        email+"','"+movieID+"',"+rating+");";

    let newRatingQuery = DB.query(newRatingSQL, (err, results) => {    
        if (err){
            console.log(err);
            callback(false);
        } else{
            callback(true);
        }
    });
}

//TODO: TESTING
// function returns movie IDs and ratings for all ratings of a given user
module.exports.getRatings = function(email){
    if (email == NULL)
        return null;
    let selectRatingSQL = "SELECT movieID, rating FROM ratings WHERE email='" + email + "';";

    let selectRatingQuery = DB.selectRatingQuery(selectRatingSQL, (err, results) => {
        if (err) throw err;

        if (results[0] == undefined)
            res.render('404');
        else // return email and ratings object
            return {
                "email" : email,
                "ratings" : results
            };
    });
    return null;
}