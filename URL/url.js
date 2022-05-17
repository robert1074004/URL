const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema({
    newURL: {
        type: String,
        requierd:true
    },
    URL: {
        type: String,
        requierd:true
    }
})
module.exports = mongoose.model('url',urlSchema)