// TODO: function takes a user's email and returns a list of IMDB ID's for recommended movies by using ML
module.exports.recommend = function(email){
    return [];
}

//TODO: TESITNG
// function processes a new movie rating for a user
// returns false if insert operation failed, true if success
module.exports.addRating = function(email, movieID, rating){

    //exit if null values
    if (email == NULL || movieID == NULL || rating == NULL)
        return false;
    
    //insert query
    let newRatingSQL = "INSERT INTO ratings (email, movieID, rating) VALUES('"+
        email+"','"+movieID+"',"+rating+");";

    let newRatingQuery = DB.newRatingQuery(newRatingSQL, (err, results) => {    
        if (err) throw error;
    });

    return true;
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