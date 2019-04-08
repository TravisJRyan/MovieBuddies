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

//TODO: function validates a login attempt
module.exports.authenticate = function (email, password, callback) {
    let existingUserSql = "SELECT * FROM users WHERE email = '" + email + "' AND pass = '" + password + "';";
    let existingUserQuery = DB.existingUserQuery(existingUserSql, (err, results) => {
        if (err) {
            console.log(err);
            callback([]);
        }else{
            if (results[0] == undefined) // no user, send to 404
                res.render('404');
            else
                callback(results);            
        }
    });
};


// function processes a new account creation
module.exports.createAccount = function (first, last, email, password, callback) {
    // return false if null values
    if (!first || !last || !email || !password){
        callback(false);
    }

    //insert query
    let newUserSQL = "INSERT INTO users (email, pass, firstName, lastName) VALUES('" +
        email + "','" + password + "','" + first + "','" + last + "');";

    let newUserQuery = DB.newUserQuery(newUserSQL, (err, results) => {
        if (err) {
            console.log(err);
            callback(false);
        }else{
            callback(true);
        }
    });
}

//TODO: TESTING
// get all of user's information for given email
// Otherwise, return null
module.exports.getUser = function (email, callback) {

    // return null if no email
    if (email == NULL)
        return null;

    // Select query
    let selectUserSQL = "SELECT firstName, lastName, age, gender, " +
        "city, st, profileDescription FROM users WHERE email='" + email + "';";

    let selectUserQuery = DB.selectUserQuery(selectUserSQL, (err, results) => {
        if (err) {
            console.log(err);
            callback(false);
        }else{
            if (results[0] == undefined){ // no user, send to 404
                res.render('404');
            }else{  // return user information
                 let user = { "email": email,
                    "firstName": results[0].firstName,
                    "lastName": results[0].lastName,
                    "age": results[0].age,
                    "gender": results[0].gender,
                    "city": results[0].city,
                    "st": results[0].st,
                    "profileDescription": results[0].profileDescription };

                callback(user);
            }
        }
    });
}

//TODO: update all fields
module.exports.updateUser = function () {

}

//TODO: function processes an update of a user's privacy setting
module.exports.updatePrivacySettings = function (email, privacyOption, callback) {
    return true;
}

//TODO: TESTING
//function processes a new friend request being sent
module.exports.sendFriendRequest = function (senderEmail, receiverEmail, callback) {

    if (senderEmail == NULL || receiverEmail == NULL){ // Check for Null values
        callback(false);
    }else{

        // Check for existing friendship
        let checkExistingSQL = "SELECT sender FROM friends WHERE (sender='" +
            sendermail + "' OR receiver='" + receiverEmail + "');";

        let checkExistingQuery = DB.checkExistingQuery(checkExistingSQL, (err, results) => {
            if (err) {
                console.log(err);
                callback(false);
            }else{
                if (results[0] == undefined) { // If no friendship, create new

                    let addNewFriendSQL = "INSERT INTO friends (sender, receiver, friendshipStatus) VALUES('" +
                        sendermail + "','" + receiverEmail + "',0);";

                    let addNewFriendQuery = DB.addNewFriendQuery(addNewFriendSQL, (err, results) => {
                        if (err) {
                            console.log(err);
                            callback(false);
                        }else{
                            callback(true);
                        }
                    });
                }
            }
        });
    }
}

//TODO: function processes the accepting of a friend request
module.exports.acceptFriendRequest = function (senderEmail, acceptingEmail) {
    return true;
}



//TODO: **QUERY** find friend as either sender or receiver
// function returns all friend emails for a given user
module.exports.getFriends = function (email) {
    if (email == NULL)
        return null;
    let selectRatingSQL = "SELECT movieID, rating FROM ratings WHERE email='" + email + "';";

    let selectRatingQuery = DB.selectRatingQuery(selectRatingSQL, (err, results) => {
        if (err) throw err;

        if (results[0] == undefined)
            res.render('404');
        else
            return {
                "email": email,
                "ratings": results
            };
    });
    return null;
}