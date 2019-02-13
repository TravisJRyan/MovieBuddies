/* MOVIE BUDDIES DATABASE INITIALIZATION 

Connection information in Google Drive Docs

*/


/*User Table
    age = 1-6 based on age group

DROP TABLE USERS;	*/

CREATE TABLE USERS (
    email VARCHAR(254),
    pass VARCHAR(255),
    firstName VARCHAR(20),
    lastName VARCHAR(20),
    age INT, 
    gender CHAR(1),
    city VARCHAR(20),
    state CHAR(2),
    profileDecsription TEXT,
    
    PRIMARY KEY(email)
);

/* Friends Table
    status = A - active, N - none, P - pending

DROP TABLE FRIENDS;		*/

CREATE TABLE FRIENDS  (
	sender VARCHAR(254),
    receiver VARCHAR(254),
    status CHAR(1),
    
	PRIMARY KEY(sender, receiver)
);

/* Ratings Table 
    rating = 1-10 scale
    
DROP TABLE RATINGS; 	*/

CREATE TABLE RATINGS (
	email VARCHAR(254),
    movieID VARCHAR(10),
	rating INT,
    
    PRIMARY KEY(email, movieID)
);