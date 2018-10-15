const express = require('express');
var shortid = require('shortid');
const router = express.Router();
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('public/lib/books.json');
var db = low(adapter);
var books = JSON.parse(fs.readFileSync('public/lib/books.json','utf-8'))

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Библиотека' });
    next();
});

router.get('/listOfBooks', (req, res, next) => {
    res.render('listOfBooks', {title: 'Список книг', books: books.arr});
    next();
});

router.get('/book', (req, res, next) => {
    res.render('book', { title: 'Карточка книги', books: books.arr });
    next();
});

router.get('/book/:id([a-zA-Z0-9]{1,})', (req, res, next) => {
    const id = req.params.id;
    var book = books.arr.find(b => b.id == id);
    if (book) {
        res.render('bookId', { title: 'Карточка книги', book: book});
    }
    next();
});

router.put('/ajax', (req, res) => {
    req.body.id = shortid.generate();
    console.log(req.body);
    db.get('arr')
        .push(req.body)
        .write();
    books.arr.push(req.body);
    res.status(200);
});

router.put('/ajax2',(req,res) => {
   var book = req.body;
    var index = -1;
    for(let i = 0; i < books.arr.length; i++) {
        if (books.arr[i].id === book.id) {
            index = i;
        }
    }
    console.log(index);
    if (index !== -1) {
        books.arr[index].in_stock = false;
        books.arr[index].master = {name:book.master.name, passport: book.master.passport}
        books.arr[index].return_date = book.return_date;
    }
    console.log(books.arr[index])

    db.get('arr')
       .find({id:book.id})
       .assign({return_date:book.return_date, in_stock:false, master:{name:book.master.name, passport: book.master.passport}})
       .write();
    res.status(200);
});

router.put('/ajax3', (req,res) => {
    var book = req.body;
    var index = -1;
    for(let i = 0; i < books.arr.length; i++) {
        if (books.arr[i].id === book.id) {
            index = i;
        }
    }
    if (index !== -1) {
        books.arr[index].in_stock = true;
        books.arr[index].master = null;
        books.arr[index].return_date = null;
    }
    db.get('arr')
        .find({id:book.id})
        .assign({id:book.id, master:null, name:books.arr[index].name,
            author:books.arr[index].author, date:books.arr[index].date, in_stock:true, return_date:null})
        .write();
    res.status(200);
});

router.delete('/ajax4', (req,res) => {
    var book = req.body;
    var index = -1;
    for(let i = 0; i < books.arr.length; i++) {
        if (books.arr[i].id === book.id) {
            index = i;
        }
    }
    db.get('arr')
        .remove(books.arr[index])
        .write();
    console.log(index)
    if (index !== -1) {
        books.arr.splice(index,1)
    }
    res.status(200);
});

router.put('/ajax5', (req,res) => {
    var book = req.body;
    var index = -1;
    for(let i = 0; i < books.arr.length; i++) {
        if (books.arr[i].id === book.id) {
            index = i;
        }
    }
    db.get('arr')
        .find({id:book.id})
        .assign({name:book.name, author:book.author, date:book.date})
        .write();
    if (index !== -1) {
        books.arr[index].name = book.name;
        books.arr[index].author = book.author;
        books.arr[index].date = book.date;
    }
    res.status(200);
});

router.get('*', (req, res) => {
    res.status(404);
});

module.exports = router;
