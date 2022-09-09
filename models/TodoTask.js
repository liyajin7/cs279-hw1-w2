// create instance of mongoose module
const mongoose = require('mongoose');

// create schema that maps to MongoDB collection "cs279-hw1-w2":
// defines shape of documents in collection
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// export collection schema to use in index.js!
module.exports = mongoose.model('TodoTask',todoTaskSchema);