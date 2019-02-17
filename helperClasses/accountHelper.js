//TODO: function validates a login attempt
module.exports.authenticate = function(email, password){
    return true;
}

//TODO: TESTING
//function processes a new account creation
module.exports.createAccount = function(first,last,email,password){
    // return false if null values
    if (first == NULL || last == NULL || email == NULL || password == NULL)
        return false;
    
    //insert query
    let newUserSQL = "INSERT INTO users (email, paswword, firstName, lastName) VALUES('"+
        email+"','"+password+"','"+first+"','"+last+"');";

    let newUserQuery = DB.newUserQuery(newUserSQL, (err, results) => {    
        if (err) throw error;
    });
    return true;
}

//TODO: TESTING
// get all of user's information for given email
// Otherwise, return null
module.exports.getUser = function(email){

    // return null if no email
    if (email == NULL)
        return null;
    
    // Select query
    let selectUserSQL = "SELECT firstName, lastName, age, gender, "+
        "city, st, profileDescription FROM users WHERE email='" + email + "';";

    let selectUserQuery = DB.selectUserQuery(selectUserSQL, (err, results) => {
        if (err) throw err;
        if (results[0] == undefined) // no user, send to 404
            res.render('404');
        else  // return user information
            return {
                "email" : email,
                "firstName" : results[0].firstName,
                "lastName" : results[0].lastName,
                "age" : results[0].age,
                "gender" : results[0].gender,
                "city" : results[0].city,
                "st" : results[0].st,
                "profileDescription" : results[0].profileDescription
            };
    });
    return null;
}

//TODO: update all fields
module.exports.updateUser = function(){

}

//TODO: function processes an update of a user's privacy setting
module.exports.updatePrivacySettings = function(email, privacyOption){
    return true;
}

//TODO: function processes a new friend request being sent
module.exports.sendFriendRequest = function(senderEmail, receiverEmail){
    return true;
}

//TODO: function processes the accepting of a friend request
module.exports.acceptFriendRequest = function(senderEmail, acceptingEmail){
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

//TODO: **QUERY** find friend as either sender or receiver
// function returns all friend emails for a given user
module.exports.getFriends = function(email){
    if (email == NULL)
        return null;
    let selectRatingSQL = "SELECT movieID, rating FROM ratings WHERE email='" + email + "';";

    let selectRatingQuery = DB.selectRatingQuery(selectRatingSQL, (err, results) => {
        if (err) throw err;

        if (results[0] == undefined)
            res.render('404');
        else 
            return {
                "email" : email,
                "ratings" : results
            };
    });
    return null;
}