const express = require("express"); // Express module for creating a server to route pages
const app = express();
const fs = require('fs'); // file system

const secretVars = JSON.parse(fs.readFileSync('secret.json', 'utf8')); // import secret vars

const accountHelper = require("../helperClasses/accountHelper");
const dataHelper = require("../helperClasses/dataHelper");


accountHelper.createAccount("Terry", "James", "qweqwe@uuop.com", "test", function (result){
    if(result){
        console.log(result);
    }
    else{
        console.log(result);
    }
});

