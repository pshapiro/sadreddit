// Modules which are used
var express = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var site = require('./site');
var search = require('./search');

var app = express();
//app.use(express.basicAuth('paul', 'samiscool'));
// Config
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Index
app.get('/', site.index);

// Get the search results
app.post('/search', search.search);

// Launch the server
app.listen(3000);
console.log('Express started');
