const mysql = require('mysql'); // MySQL
const fs = require('fs'); // file system
const bcrypt = require('bcrypt');
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
    let existingUserSql = "SELECT * FROM users WHERE email = '" + email + "';";
    let existingUserQuery = DB.query(existingUserSql, (err, results) => {
        bcrypt.compare(password, results[0].pass, function (err, res) {
            if (err) {
                console.log(err);
                callback([]);
            } else {
                if (res == false) { // no user, send to 404
                    callback('404');
                } else {
                    callback(results);
                }
            }
        });
    });
};

// function to add a new friend
module.exports.newFriendRequest = function (sender, receiver, callback) {
    if (!sender || !receiver)
        callback(-1);
    else {
        let newFriendSql = "INSERT INTO Friends VALUES('" + sender + "', '" + receiver + "', 0);";
        let newFriendQuery = DB.query(newFriendSql, (err, results) => {
            if (err) {
                console.log(err);
                callback(-1);
            } else {
                callback(results);
            }
        });
    }
}

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

// get all of user's information for given email
module.exports.getUser = function (email, callback) {
    // return empty if no email
    if (!email) {
        callback({});
    } else {
        // Select query
        let selectUserSQL = "SELECT firstName, lastName, age, gender, " +
            "city, st, profileDescription, privacy FROM users WHERE email='" + email + "';";
        let selectUserQuery = DB.query(selectUserSQL, (err, results) => {
            if (err) {
                console.log(err);
                callback({});
            } else {
                if (results[0] == undefined) {
                    callback({});
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

// update settings for a user
module.exports.updateSettings = function (email, newSettings, callback) {
    let updateUserSql = "UPDATE Users SET age=" + newSettings.age + ", gender='" + newSettings.gender +
        "', city='" + newSettings.city + "', st='" + newSettings.state + "', profileDescription='" +
        newSettings.profileDescription + "', privacy=" + newSettings.privacy + " WHERE email='" + email + "';";
    let updateSettingsQuery = DB.query(updateUserSql, (err, results) => {
        if (err)
            console.log(err);
        else
            callback(results);
    });
}

module.exports.validateUserExists = function (email, callback) {
    if (!email)
        callback(false);
    else {
        let validateUserSql = "SELECT email FROM Users WHERE email = '" + email + "';";
        let validateUserQuery = DB.query(validateUserSql, (err, results) => {
            if (err) throw err;
            if (results.length > 0)
                callback(true);
            else
                callback(false);
        });
    }
}

module.exports.declineFriendship = function (senderEmail, receiverEmail, callback) {
    let removeRequest = "DELETE FROM friends WHERE  sender = '" + senderEmail + "' and receiver = '" + receiverEmail + "';"
    let removeQuery = DB.query(removeRequest, (err, results) => {
        if (err) {
            throw err;
            callback(false);
        } else {
            callback(true);
        }
    });
}

module.exports.addFriendship = function (senderEmail, acceptingEmail, callback) {
    let updateFriendStatus = "Update friends Set friendshipStatus = 1 WHERE receiver = '" + acceptingEmail + "';"
    let updateFriendQuery = DB.query(updateFriendStatus, (err, results) => {
        if (err) {
            throw err;
            callback(false);
        } else {
            callback(true);
        }
    });
}

// get all friends for a given email
module.exports.getFriends = function (email, callback) {
    if (!email)
        callback([]);
    else {
        let getFriendsSql = "SELECT sender, receiver FROM friends WHERE ((sender = '" + email + "') OR (receiver = '" + email + "')) " +
            "AND friendshipStatus = 1;"
        let getFriendsQuery = DB.query(getFriendsSql, (err, results) => {
            if (err) throw err;
            if (results.length == 0)
                callback([]);
            else {
                callback(results);
            }
        });
    }
}

// check friend status (none/pending/accepted) for 2 given users
module.exports.isFriend = function (firstEmail, secondEmail, callback) {
    if (!firstEmail || !secondEmail)
        callback(-1);
    else {
        let isFriendSql = "SELECT friendshipStatus FROM friends WHERE (sender = '" + firstEmail + "' AND receiver = '" + secondEmail + "') OR " +
            "(sender = '" + secondEmail + "' AND receiver = '" + firstEmail + "')";
        let isFriendQuery = DB.query(isFriendSql, (err, results) => {
            if (err) throw err;
            if (results.length == 0)
                callback(-1); //callback -1 if no friend requests ever sent
            else {
                callback(results[0]['friendshipStatus']); //callback 0 or 1 based on friendship status (pending/accepted)
            }
        });
    }
}

// Get all pending friend requests for a given user
module.exports.getPendingRequests = function (email, callback) {
    if (!email)
        callback([]);
    let selectPendingSql = "SELECT sender FROM Friends WHERE receiver = '" + email + "' AND friendshipStatus = 0;"
    let selectPendingQuery = DB.query(selectPendingSql, (err, results) => {
        if (err) throw err;
        callback(results);
    });
}

// function is run after unit tests to clear test data
module.exports.clearTestData = function (callback) {
    let clearUserSql = "DELETE FROM Users WHERE email='qweqwe@uuop.com';";
    let clearUserQuery = DB.query(clearUserSql, (err, results) => {
        if(err)
            console.log(err);
        let clearRatingSql = "DELETE FROM Ratings WHERE email='test@test.com' AND movieID='tt5460858';";
        let clearRatingQuery = DB.query(clearRatingSql, (err, results) => {
            if(err)
                console.log(err);
            let clearFriendSql="DELETE FROM Friends WHERE sender='test@test.com' AND receiver='testing@test.com';"
            let clearFriendQuery = DB.query(clearFriendSql, (err, results) => {
                if (err)
                    console.log(err);
                callback();
            });
        });
    });
}

module.exports.findUsers = function(searchTerm, callback) {
    let findUsersSql = "SELECT email FROM Users WHERE email='"+searchTerm+"';";
    let findUsersQuery = DB.query(findUsersSql, (err, results) => {
        if (err)
            console.log(err);
        callback(results);
    });
}