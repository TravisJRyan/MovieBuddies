# MovieBuddies #
CS496 Senior Software Project: A data-driven social media website for movie lovers

## Tools Used ##

JS and CSS Tools:
Node.js, Bootstrap, Popper.js, JQuery

Node.js modules used: Body-Parser, Express, Express-Session, FS, MySql, Pug, Request, Bcrypt

Python (ML) Tools: NumPy, MatPy, Pandas

APIs: OMDB API for movie data

## Setup Instructions ##
To run the project locally, install Node.js and NPM on your computer. Open the project directory and in the terminal, run "npm install" to install dependencies and then run "node index.js" to run the project. The secrets JSON file has been git ignored while the project was in production for security, but so the professor is able to run the project without issue, our database credentials (secret.json) has been committed to Git.

## How to Run Unit Tests ##
The unit tests are located in helperClasses/test.js. To run them, run "node helperClasses/test.js" to run the file with Node. This should create an account, retrieve it, create a rating, retrieve all ratings for a user, and then delete generated test data. The success messages should be console logged. At the time of submission, all of these unit tests return successful results on our local machines. Feel free to reach out to the team with issues.

## Project Location ##
The website should be hosted here: http://142.93.159.0:3000
