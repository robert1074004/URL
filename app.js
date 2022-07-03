const express = require('express')
const mongoose = require('mongoose')
const URLS = require('./URL/url')
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const app = express()
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const {
    redirect
} = require('express/lib/response')

const lower = 'abcdefghijklmnopqrstuvwxyz'.split("")
const upper = lower.map(i => i.toUpperCase())
const number = '0123456789'.split("")
let collection = lower.concat(upper, number)

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected')
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/error', (req, res) => {
    res.render('error')
})

app.post('/', (req, res) => {
    const url = req.body.url
    // 檢查url是否為空白或不符合網址格式
    if (url.trim() === '' || !url.includes('https://')) {
        return res.redirect('error')
    }
    // 檢查url是否重複
    URLS.findOne({
            URL: url
        })
        // 找得到資料，代表url已重複
        .then(url => {
            return res.redirect(`/end/${url._id}`)
        })
        // 找不到資料，新增新的url到資料庫
        .catch(() => {
            let Numbers = ""
            for (let i = 0; i < 5; i++) {
                Numbers += collection[Math.floor(Math.random() * collection.length)]
            }
            const newURL = Numbers
            URLS.create({
                    newURL: newURL,
                    URL: url
                })
                .then(newurl => {
                    URLS.findOne({
                            URL: newurl.URL
                        })
                        .then(url => {
                            res.redirect(`/end/${url._id}`)
                        })
                })
        })
})


app.get('/end/:id', (req, res) => {
    const id = req.params.id
    return URLS.findById(id)
        .lean()
        .then(url => res.render('end', {
            url
        }))
        .catch(error => console.log(error))
})

app.get('/:newURL', (req, res) => {
    const newURL = req.params.newURL
    URLS.findOne({
            newURL
        })
        .then(url => res.redirect(`${url.URL}`, 302))
        .catch(error => console.log(error))
})


app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})