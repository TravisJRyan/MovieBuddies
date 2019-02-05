//TODO: function validates a login attempt
module.exports.authenticate = function(email, password){
    return true;
}

//TODO: function processes a new account creation
module.exports.createAccount = function(first,last,email,password){
    return true;
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

//TODO: function returns movie IDs and ratings for all ratings of a given user
module.exports.getRatings = function(email){
    return true;
}

//TODO: function returns all friend emails for a given user
module.exports.getFriends = function(email){
    return true;
}