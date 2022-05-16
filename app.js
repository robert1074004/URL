const express = require('express')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://root:abc83213@learning.lmzd7.mongodb.net/URL?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
const app = express()
const exphbs = require('express-handlebars');

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

const db = mongoose.connection

db.on('error',() => {
    console.log('mongodb error!')
})

db.once('open',() => {
    console.log('mongodb connected')
})

app.get('/',(req,res) => {
    res.render('index')
})

app.listen(3000,() => {
    console.log('App is running on http://localhost:3000')
})