const express = require("express"); // Express module for creating a server to route pages
const app = express();
const fs = require('fs'); // file system

const secretVars = JSON.parse(fs.readFileSync('secret.json', 'utf8')); // import secret vars

const accountHelper = require("../helperClasses/accountHelper");
const dataHelper = require("../helperClasses/dataHelper");

// Testing success and failure to login
accountHelper.createAccount("Terry", "James", "qweqwe@uuop.com", "test", function (result){
    if(result){
        console.log(result);
    }
    else{
        console.log(result);
    }
});

// Test to get the user data
accountHelper.getUser("qweqwe@uuop.com", function (result){
    if(result){
        console.log(result);
    }
    else{
        console.log(result);
    }
});

// Test to send a friend request/ return True if success and False if fail
accountHelper.sendFriendRequest('test@test.com', 'testing@test.com', function(result){
    if(result){
        console.log(result);
    }
    else{
        console.log(result);
    }
});

// Test for adding a rating for a movie to current user
dataHelper.addRating('test@test.com', movieID, 8, function(result){

});

// Test to get all rates for current user
dataHelper.getRatings('test@test.com', function(result){

});


