const express = require("express"); // Express module for creating a server to route pages
const app = express();
const fs = require('fs'); // file system

const secretVars = JSON.parse(fs.readFileSync('secret.json', 'utf8')); // import secret vars

const accountHelper = require("../helperClasses/accountHelper");
const dataHelper = require("../helperClasses/dataHelper");

// Running all tests in order
accountHelper.createAccount("Terry", "James", "qweqwe@uuop.com", "test", function (result){
    console.log("Account created successfully.");
    accountHelper.getUser("qweqwe@uuop.com", function (result){
        console.log("Account retrieved successfully");
        accountHelper.newFriendRequest('test@test.com', 'testing@test.com', function(result){
            console.log("Friend request created successfully");
            dataHelper.addRating('test@test.com', 'tt5460858', 8, function(result){
                console.log("Movie rated successfully.");
                dataHelper.getRatings('test@test.com', function(result){
                    console.log("Ratings retrieve successfully.");
                    accountHelper.clearTestData(function(result){
                        console.log("All test data cleared successfully.");
                    });
                });
            });
        });
    });
});
