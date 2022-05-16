const express = require('express')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://root:abc83213@learning.lmzd7.mongodb.net/URL?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
const app = express()
const exphbs = require('express-handlebars');

const lower = 'abcdefghijklmnopqrstuvwxyz'.split("")
const upper = lower.map(i => i.toUpperCase())
const number = '0123456789'.split("")
let collection = lower.concat(upper,number)

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

const db = mongoose.connection

db.on('error',() => {
    console.log('mongodb error!')
})

db.once('open',() => {
    console.log('mongodb connected')
})

app.get('/',(req,res) => {
    let Number = ""
    for (let i = 0 ; i<5 ; i++){
        Number += collection[Math.floor(Math.random()*collection.length)]
    }
    console.log(Number)
    res.render('index')
})

app.get('/end',(req,res) => {
    
    res.render('end')
})

app.listen(3000,() => {
    console.log('App is running on http://localhost:3000')
})