const express = require('express'); // Express module
const app = express(); // init Express server
app.set('view engine', 'pug'); // use Pug to render pages

// Start server listening
app.listen('3000', () => {
    console.log('Server started on port 3000');
});

app.use(express.static(__dirname));

app.get('/', function(req, res){
    res.render("test");
});