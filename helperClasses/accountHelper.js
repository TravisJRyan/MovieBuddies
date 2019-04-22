const mysql = require('mysql'); // MySQL
const fs = require('fs'); // file system
const secretVars = JSON.parse(fs.readFileSync('secret.json', 'utf8')); // import secret vars

var DB;

// Function to Handle Disconnect Issue
// Source: https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection
function handleDisconnect() {
    DB = mysql.createConnection({
        host: secretVars["host"],
        user: secretVars["user"],
        password: secretVars["password"],
        database: secretVars["database"]
    });

    DB.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    DB.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

//TODO: function validates a login attempt
module.exports.authenticate = function (email, password, callback) {
    let existingUserSql = "SELECT * FROM users WHERE email = '" + email + "' AND pass = '" + password + "';";
    let existingUserQuery = DB.query(existingUserSql, (err, results) => {
        if (err) {
            console.log(err);
            callback([]);
        } else {
            if (results[0] == undefined) { // no user, send to 404
                callback('404');
            } else {
                callback(results);
            }
        }
    });
};


// function processes a new account creation
module.exports.createAccount = function (first, last, email, password, callback) {
    // return false if null values
    if (!first || !last || !email || !password) {
        callback(false);
    }

    //insert query
    let newUserSQL = "INSERT INTO users (email, pass, firstName, lastName) VALUES('" +
        email + "','" + password + "','" + first + "','" + last + "');";

    let newUserQuery = DB.query(newUserSQL, (err, results) => {
        if (err) {
            console.log(err);
            callback(false);
        } else {
            callback(true);
        }
    });
}

//TODO: TESTING
// get all of user's information for given email
// Otherwise, return null
module.exports.getUser = function (email, callback) {
    // return null if no email
    if (email == NULL) {
        callback(null);
    } else {
        // Select query
        let selectUserSQL = "SELECT firstName, lastName, age, gender, " +
            "city, st, profileDescription, privacy FROM users WHERE email='" + email + "';";
        let selectUserQuery = DB.query(selectUserSQL, (err, results) => {
            if (err) {
                console.log(err);
                callback(null);
            } else {
                if (results[0] == undefined) { // no user, send to 404
                    res.render('404');
                } else {  // return user information
                    let user = {
                        "email": email,
                        "firstName": results[0].firstName,
                        "lastName": results[0].lastName,
                        "age": results[0].age,
                        "gender": results[0].gender,
                        "city": results[0].city,
                        "st": results[0].st,
                        "profileDescription": results[0].profileDescription,
                        "privacy": results[0].privacy
                    };
                    callback(user);
                }
            }
        });
    }
}

//TODO: update all fields
module.exports.updateUser = function (email, ) {

}

//TODO: function processes an update of a user's privacy setting
module.exports.updatePrivacySettings = function (email, privacyOption, callback) {
    return true;
}

//TODO: TESTING
//function processes a new friend request being sent
module.exports.sendFriendRequest = function (senderEmail, receiverEmail, callback) {

    if (senderEmail == NULL || receiverEmail == NULL) { // Check for Null values
        callback(false);
    } else {
        // Check for existing friendship
        let checkExistingSQL = "SELECT * FROM friends WHERE sender='" + senderEmail + "' AND receiver='" + receiverEmail
            + "UNION" +
            "SELECT * FROM friends WHERE receiver='" + senderEmail + "' AND receiver='" + senderEmail + "';";

        let checkExistingQuery = DB.query(checkExistingSQL, (err, results) => {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                if (results[0] == undefined) { // If no friendship, create new
                    let addNewFriendSQL = "INSERT INTO friends (sender, receiver, friendshipStatus) VALUES('" +
                        sendermail + "','" + receiverEmail + "',0);";
                    let addNewFriendQuery = DB.query(addNewFriendSQL, (err, results) => {
                        if (err) {                           
                            console.log(err);
                            callback(false);
                        } else {
                            callback(true);
                        }
                    });
                } else {  //If friendship exists, do not create new
                    callback(false);
                }
            }
        });
    }
}

module.exports.validateUserExists = function(email, callback) {
    if(!email)
        callback(false);
    //let validateUserSql = SELECT email FROM Users WHERE email = 'test@test.com';
}

module.exports.declineFriendship = function (senderEmail, receiverEmail, callback) {
    callback(true);
}

module.exports.addFriendship = function (senderEmail, acceptingEmail, callback) {
    callback(true);
}


//TODO: All pending friend requests for given user email
module.exports.getPendingRequests = function (email, callback) {
    if(!email)
        callback([]);
    let selectPendingSql = "SELECT sender FROM Friends WHERE receiver = '"+email+"' AND friendshipStatus = 0;"
    let selectPendingQuery = DB.query(selectPendingSql, (err, results) => {
        if (err) throw err;
        callback(results);
    });
}



//TODO: **QUERY** find friend as either sender or receiver
// function returns all friend emails for a given user
module.exports.getFriends = function (email) {
    if (email == NULL)
        return null;
    let selectRatingSQL = "SELECT * FROM ratings WHERE email='" + email + "';";
    let selectRatingQuery = DB.query(selectRatingSQL, (err, results) => {
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