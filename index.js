const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/pool')

const app = express()

app.use(express.urlencoded(
    {
        extended: true
    }
))

app.use(express.json())

app.use(express.static('public'))
app.engine('handlebars', exphbs.engine())
app.set('view engine','handlebars')



app.get('/',(req,res)=>{
    res.render('home')
})

app.post('/books/insertbook',(req,res)=>{
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `INSERT INTO book (??, ??) VALUES(?,?)`
    const data = ['title', 'pageqty', title, pageqty]


    pool.query(sql, data, (err)=>{
        if (err) {
            console.log(err)
        }
        console.log('dados inseridos')
        res.redirect('/books')
    })
})

app.get('/books', (req,res)=>{
    const sql = "SELECT * FROM book"

    pool.query(sql,(err, data)=>{
        if (err) {
            console.log(err)  
            return      
        }

        const books = data

        res.render('book', { books })

    })
    
})
app.get('/books/:id', (req,res)=>{
    
    const id = req.params.id

    const sql = `SELECT * FROM book WHERE ?? = ?`

    const data = ['id',id]

    pool.query(sql,data, (err,data)=>{
        if (err) {
            console.log(err)
        }
        const book = data[0]

        res.render('booksolo',{book})
    })
})

app.get('/books/edit/:id', (req,res)=>{
    
    const id = req.params.id
    
    const sql = `SELECT * FROM book WHERE ?? = ?`
    const data = ['id',id]
    pool.query(sql, data,(err, data)=>{

        if (err) {
            console.log(err)            
        }
        
        const book = data[0]
        
        res.render('editbook',{book})

    })
})

app.post('/books/updatebook/', (req,res)=>{
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `UPDATE book SET ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title', title, 'pageqty', pageqty ,'id' ,  id]
    pool.query(sql, data, (err)=>{
        if (err) {
            console.log(err)
            return
        }
        
        res.redirect('/books')


    })

})

app.post('/books/remove/:id', (req,res)=>{
    const id = req.params.id

    const sql = `DELETE FROM book WHERE ?? = ?`
    const data = ['id', id]
    pool.query(sql,data, (err)=>{
        if (err) {
            console.log(err)
        }

        res.redirect('/books')
    })

})


app.listen(3000,()=>{
    console.log('app rodando na porta 3000')
})
