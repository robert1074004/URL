const express = require('express')
const mongoose = require('mongoose')
const URL = require('./URL/url')
mongoose.connect('mongodb+srv://root:abc83213@learning.lmzd7.mongodb.net/URL?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
const app = express()
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')

const lower = 'abcdefghijklmnopqrstuvwxyz'.split("")
const upper = lower.map(i => i.toUpperCase())
const number = '0123456789'.split("")
let collection = lower.concat(upper,number)

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

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

app.post('/',(req,res) => {
    let Number = ""
    for (let i = 0 ; i<5 ; i++){
        Number += collection[Math.floor(Math.random()*collection.length)]
    }
    const url = req.body.url
    const newURL = 'http://localhost/'+Number
    return URL.create({newURL:newURL,URL:url})
    .then(() => res.redirect('/end'))
    .catch(error => console.log(error))
})

app.get('/end',(req,res) => {
    
    res.render('end')
})

app.listen(3000,() => {
    console.log('App is running on http://localhost:3000')
})