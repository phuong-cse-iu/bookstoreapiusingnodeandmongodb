var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var redis = require('redis')

app.use(bodyParser.json());
Genre = require('./models/genre');
Book = require('./models/book');
// connect to mongoose
mongoose.connect('mongodb://localhost/bookstore');
// database object
var db = mongoose.connection;


client = redis.createClient()
client.on('error', function(err) {
	console.log("Error: " + err)
})

// get request with url: /
app.get('/', function(req, res) {
	res.send('Hello World!');
});

// get request for url: /api/books
// get all books
app.get('/api/books', function(req, res) {
	
	Book.getBooks(function(err, books) {
		if (err) {
			throw err;
		}
		res.json(books);
	});
});

app.get('/api/books/:_id', function(req, res) {
	var id = req.params._id
	
	client.get(id, function(err, result) {
		if (err) {
			throw err
		} else {
			// if value already exists in redis
			if (result) {
				
				// res.send({"book": resultInJSON, "source": "redis cache"})
				console.log(result)
				res.send(result)
			} else {
				Book.getBookById(id, function(err, book) {
					if (err) {
						throw err;
					}
					
					
					client.setex(id, 60, JSON.stringify(book))
					res.json(book)
				});

			}
		}
	})
	
});


app.post('/api/books', function(req, res) {
	Book.addBook(req.body, function(err, book) {
		if (err) {
			throw err;
		}
		res.json(book);
	})
});

app.put('/api/books/:_id', function(req, res) {
	var id = req.params._id;
	var book = req.body;
	Book.updateBook(id, book, {}, function(err, book) {
		if (err) {
			throw err;
		}
		res.json(book);
	});
});

app.delete('/api/books/:_id', function(req, res) {
	var id = req.params._id;
	Book.removeBook(id, function(err, book) {
		if (err) {
			throw err;
		}
		res.json(book);
	})
})



// get all genres
app.get('/api/genres', function(req, res) {
	Genre.getGenres(function(err, genres) {
		if (err) {
			throw err;
		}
		res.json(genres);
	});
});

app.get('/api/genres/:_id', function(req, res) {
	Genre.getGenreById(req.params._id, function(err, genre) {
		if (err) {
			throw err
		}
		res.json(genre);
	});
});

app.post('/api/genres', function(req, res) {
	var genre = req.body;
	Genre.addGenre(genre, function(err, genre) {
		if (err) {
			throw err;
		}
		res.json(genre);
	})
});

app.put('/api/genres/:_id', function(req, res) {
	var id = req.params._id;
	var genre = req.body;
	Genre.updateGenre(id, genre, {}, function(err, genre) {
		if (err) {
			throw err;
		}
		res.json(genre);
	});
});

app.delete('/api/genres/:_id', function(req, res) {
	var id = req.params._id;
	Genre.removeGenre(id, function(err, genre) {
		if (err) {
			throw err;
		}
		res.json(genre);
	});
});

app.listen(3000);
console.log('Server running on port 3000');