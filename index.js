const express = require('express'); // Express module for creating a server to route pages
const app = express(); // init Express server as a variable
app.set('view engine', 'pug'); // have the server use Pug to render pages

// Start server listening at port 3000 (localhost:3000)
app.listen('3000', () => {
    console.log('Server started on port 3000...');
});

// Allow the server to access static files in the same directory
app.use(express.static(__dirname));

// Route for the home page
app.get('/', function(req, res){
    res.render("test"); // Render the pug file "test"
});