var mongoose = require('mongoose');

// book schema
var bookSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	genre: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	author: {
		type: String,
		required: true
	},
	publisher: {
		type: String
	},
	pages: {
		type: String
	},
	image_url: {
		type: String
	},
	buy_url: {
		type: String
	},
	create_date: {
		type: Date,
		default: Date.now
	}
});

var Book = module.exports = mongoose.model('Book', bookSchema);

module.exports.getBooks = function(callback) {
	Book.find(callback);
};

module.exports.getBookById = function(id, callback) {
	Book.findById(id, callback);
};

module.exports.addBook = function(book, callback) {
	Book.create(book, callback);
};

module.exports.updateBook = function(id, newBook, options, callback) {
	var query = {_id: id};
	var update = {
		"title": newBook.title,
		"genre": newBook.genre,
		"description": newBook.description,
		"author": newBook.author,
		"publisher": newBook.publisher,
		"pages": newBook.pages,
		"image_url": newBook.image_url,
		"buy_url": newBook.buy_url
	}
	Book.findOneAndUpdate(query, update, options, callback);
};

module.exports.removeBook = function(id, callback) {
	var query = {_id: id};
	Book.remove(query, callback);
}