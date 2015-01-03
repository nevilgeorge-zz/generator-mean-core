// server/routes.js

// add the 'Thing' model to this file
var Thing = require('models/thing.js');

module.exports = function(app) {


	// add REST API for any model here

	// the Thing model is used as an example
	// GET REQUEST - get Thing by object ID
	app.get('/api/thing/:id', function(req, res) {
		// get the ID parameter passed into the GET request on the Angular side
		var id = req.params.id;

		// use mongoose's built-in "findById" method and pass in the ID as one of the parameter
		// the second paramter is a callback to be executed once the finding is done
		Thing.findById(id, function(err, thing) {
			if (err) {
				// if an error occured, return the error to the client-side
				return res.send(500, err);
			}

			if (!thing) {
				// if the item being searched for is not found, return a 404 error
				return res.send(404);
			}

			// if no problems, return this instance of thing as a JSON to the client-side
			res.json(thing);
		});
	});

	// POST REQUEST - create a thing
	app.post('/api/thing', function(req, res) {
		// assume that the values for the fields of Thing are passed in through the body of the POST request
		if (!req.body) {
			// if no fields passed in, return an error because we cannot create a new instance of Thing
			return res.send(404);
		}
		var newThing = new Thing();
		newThing = req.body.name;
		newThing = req.body.type;
		newThing = req.body.description;
		newThing = req.body.owner;

		// call mongoose's save method to save this instance of Thing to the MongoDB database
		newThing.save(function(err, thing) {
			if (err) {
				// if error occurred in saving, send the error to the client-side
				return res.send(500, err);
			}
			// if everything is okay, send the new instance of Thing to the client-side
			res.json(thing);
		});
	});

	// PUT REQUEST - update a thing by ID
	app.put('/api/thing/:id', function(req, res) {
		// get ID passed in as parameter in the request
		var id = req.params.id;

		if (!req.body) {
			return res.send(400);
		}

		Thing.findById(id, function(err, thing) {
			if (err) {
				// if error occurs, return the error
				return res.send(500, err);
			}

			if (!thing) {
				// if Thing with specified ID is not defined, return an error
				return res.send(404);
			}

			// update values of thing
			thing.name = req.body.name;
			thing.type = req.body.type;
			thing.description = req.body.description;
			thing.owner = req.body.owner;

			// save the updated thing to the database again

			thing.save(function(err, thing) {
				if (err) {
					return res.send(500, err);
				}
				// once save is successful, send it to the client-side
				res.json(thing);
			});
		});
	});

	// DELETE REQUEST - delete a thing by ID
	app.delete('/api/thing/:id', function(req, res) {
		var id = req.params.id;

		Thing.findById(id, function(err, thing) {
			if (err) {
				// error occurred attempting to find the thing
				return res.send(500, err);
			}

			if (!thing) {
				// thing does not exist in the database so return a 404 error.
				return res.send(404);
			}

			// use the mongoose built-in method remove
			thing.remove(function(err) {
				if (err) {
					return res.send(500, err);
				}
				// tell the front end that the thing was successfully removed from the database
				res.send(true);
			});
		});
	});

	// handle Angular frontend routes
	// all undefined routes will go to this route, hence placed last
	app.get('*', function(req, res) {
		// load index.html in "public" folder
		res.sendfile('./public/index.html');
	});

}