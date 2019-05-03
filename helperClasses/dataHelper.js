const mysql = require('mysql'); // MySQL
const fs = require('fs'); // file system
const secretVars = JSON.parse(fs.readFileSync('secret.json', 'utf8')); // import secret vars
const request = require('request'); // HTTP request module

var DB;

// Function to Handle Disconnect Issue
// Source: https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection
function handleDisconnect(callback) {

    DB = mysql.createConnection({
        host: secretVars["host"],
        user: secretVars["user"],
        password: secretVars["password"],
        database: secretVars["database"]
    });

    DB.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect(callback), 2000);
        }
        else {
            callback();
        }
    });
    DB.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(callback);
        } else {
            throw err;
        }
    });

}

// TODO: function takes a user's email and returns a list of IMDB ID's for recommended movies by using ML
module.exports.recommend = function (email, callback) {
    handleDisconnect(function () {

        //exit if null value
        if (!email)
            callback(false);

        let ratingsSQL = "select movieID, rating " +
            "from ratings " +
            "where email='" + email + "';";

        let ratingQuery = DB.query(ratingsSQL, (err, results) => {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                request.post('http://localhost:3001/predict',
                    { json: JSON.stringify(results) },
                    function (error, response, body) {
                        if (error)
                            console.log(error);
                        else
                            callback(body);
                    });
            }
        });
    });

}

// function processes a new movie rating for a user
// callbacks false if insert operation failed, true if success
// TODO: Need to add timestamps to ratings so we can sort them for user pages
module.exports.addRating = function (email, movieID, rating, callback) {
    handleDisconnect(function () {

        //exit if null values
        if (!email || !movieID || !rating)
            callback(false);

        //insert query
        let newRatingSQL = "INSERT INTO ratings " +
            "(email, movieID, rating, datetime) " +
            "VALUES " +
            "('" + email + "', '" + movieID + "', " + rating + ", NOW()) " +
            "ON DUPLICATE KEY UPDATE " +
            "rating = VALUES(rating), " +
            "movieID = VALUES(movieID), " +
            "datetime = VALUES(datetime)";

        let newRatingQuery = DB.query(newRatingSQL, (err, results) => {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                callback(true);
            }
        });
    });
}

module.exports.getRecentRatings = function (email, callback) {
    handleDisconnect(function () {

        if (!email)
            callback(false);

        let getRatingsSql = "SELECT * FROM Ratings WHERE email='" + email + "' LIMIT 10;";
        let getRatingQuery = DB.query(getRatingsSql, (err, results) => {
            if (err) {
                console.log(err);
                callback([]);
            } else {
                callback(results);
            }
        });
    });
}

//TODO: TESTING
// function returns movie IDs and ratings for all ratings of a given user
module.exports.getRatings = function (email, callback) {
    handleDisconnect(function () {

        if (!email)
            callback(false);

        let getRatingsSql = "SELECT * FROM Ratings WHERE email='" + email + "' ORDER BY datetime;";
        let getRatingQuery = DB.query(getRatingsSql, (err, results) => {
            if (err || results.length == 0) {
                callback([]);
            } else {
                callback(results);
            }
        });
    });
}

//TODO: TESTING
// function returns rating for a movie for a given user
module.exports.getRating = function (email, movieId, callback) {
    handleDisconnect(function () {

        let selectRatingSQL = "SELECT rating FROM ratings WHERE email='" + email + "' AND movieID='" + movieId + "' ORDER BY datetime;";
        let selectRatingQuery = DB.query(selectRatingSQL, (err, results) => {
            if (err) {
                console.log(err);
                callback(-1); // error indicator
            }
            if (results.length == 0)
                callback([])
            else
                callback(results[0]['rating']);
        });
    });
}