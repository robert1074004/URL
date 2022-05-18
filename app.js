const express = require('express')
const mongoose = require('mongoose')
const URL = require('./URL/url')
mongoose.connect('mongodb+srv://root:abc83213@learning.lmzd7.mongodb.net/URL?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
const app = express()
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const { redirect } = require('express/lib/response')

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

app.get('/error',(req,res) => {
    res.render('error')
})

app.post('/',(req,res) => {
    const url = req.body.url
    // 檢查url是否為空白
    if (url.trim() === '') {
        res.redirect('error')
    } else {
        URL.find().lean()
        .then(urls => {
            // 檢查url是否重複
            let repeat = urls.some(URL => URL.URL === url)
            // 如果重複
            if (repeat) {
                let information = urls.find(URL => URL.URL === url)
                res.redirect(`/end/${information._id}`)
            // 如果沒重複
            } else { 
                let Number = ""
                for (let i = 0 ; i<5 ; i++){
                    Number += collection[Math.floor(Math.random()*collection.length)]
                }
                const newURL = 'http://localhost:3000/'+Number
                return URL.create({newURL:newURL,URL:url})
                    .then(() =>  {
                        URL.find().lean()
                        .then(urls => {
                            let information = urls.find(url => url.newURL === newURL)
                            res.redirect(`/end/${information._id}`)
                        }   
                            )
                        })
                    .catch(error => console.log(error))
            }
        })
        .catch(error => console.log(error))
    }
})

app.get('/end/:id',(req,res) => {
    const id = req.params.id
    return URL.findById(id)
                .lean()
                .then(url =>  res.render('end',{url}))
                .catch(error => console.log(error))       
})

app.get('/:newURL',(req,res) => {
    const newURL = 'http://localhost:3000/'+req.params.newURL
    URL.find()
        .lean()
        .then(urls => {
            let information = urls.find(url => url.newURL === newURL)
            res.redirect(`${information.URL}`,302)
        } )
        .catch(error => console.log(error))          
})


app.listen(3000,() => {
    console.log('App is running on http://localhost:3000')
})