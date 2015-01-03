// server.js
/*
 * @name <%= appName %>
 * @description
 * # <%= appName %>
 *
*/

'use strict';

// MODULES =======================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');


// CONFIGURATION =================================
// add file that contains information on our database
var db = require('./config/database');

// connect to database
mongoose.connect(db.url);

// set our port
var port = process.env.PORT || 8080;

// enable req.body usage
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlecnoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/dist'));

// allow the index.html to have file paths relative to /bower_components
app.use(express.static('/bower_components', __dirname + '/bower_components'));

// ROUTES =========================================
// pass our app into our routes.js file
require('./server/routes')(app);

// start the app

app.listen(port, function() {
	console.log('Some cool stuff is happening on port ' + port);
});

// expose the app
module.exports = app;