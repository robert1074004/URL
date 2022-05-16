const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema({
    name: {
        type: String,
        requierd:true
    }
})
module.exports = mongoose.URL('url',urlSchema)