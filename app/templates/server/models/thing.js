// server/models/thing.js

// mongoose is the Node.js module that handles interfacing with MongoDB in our app
var mongoose = require('mongoose');

// create a mongoose schema that will be used as a model
var thingSchema = new mongoose.Schema({
	// what members will the 'Thing' class have? Feel free to elaborate!
	name: String,
	type: String,
	description: String,
	owner: String
});

// expose the thingsSchema as a mongoose model
module.exports = mongoose.model('Thing', thingSchema);