const express = require('express')
const router = express.Router()

let data = require('./../data/data.js')

//create
router.post('/', (req, res) => {
    let DB = data.readData()
    let body = req.body

    if (!body.isbn) {
        res.status(400).send("Isbn  is required!")
        return
    }
    if (!body.title) {
        res.status(400).send("Title  is required!")
        return
    }
    if (!body.gener) {
        res.status(400).send("Gener  is required!")
        return
    }
    if (!body.description) {
        res.status(400).send("Description  is required!")
        return
    }
    if (!body.author) {
        res.status(400).send("Author  is required!")
        return
    }
    if (!body.publish_year) {
        res.status(400).send("Publish year  is required!")
        return
    }
    if (!body.cover_photo) {
        res.status(400).send("Cover photo  is required!")
        return
    }


    for (let i = 0; i < DB.book.length; i++) {
        const element = DB.book[i];
        if (element.id == body.id) {
            res.status(400).send(`id:${body.id} does not exists!`);
            return
        }
    }

    body.created_at = new Date()
    DB.book.push(body)
    data.writeData(DB)
    res.status(201).send("successfully created!")

})
//read
router.get('/', (req, res) => {
    let DB = data.readData()
    let search = req.query.search

    if (!search) {
        search = ""
    }

    let list = DB.book.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))


    if (list.length == 0) {
        res.status(404).send("book resource not found!")
        return
    }

    res.json(list)
})


router.get('/:id', (req, res) => {
    let DB = data.readData()
    let id = req.params.id

    let book = DB.book.find(e => e.id == id)
    if (!book) {
        res.status(400).send(`book id:${id} not found!`);
        return
    }

    res.status(200).json(book)
})

//update

router.put('/', (req, res) => {
    let DB = data.readData()
    let body = req.body

    let book = DB.book.find(e => e.id == body.id)

    if (!book) {
        res.status(400).send(`book id:${body.id} does not exist!`);
        return
    }

    for (let i = 0; i < DB.book.length; i++) {
        const element = DB.book[i];
        if (element.id == body.id) {
            body.created_at = DB.book[i].created_at
            body.updated_at = new Date()
            DB.book[i] = body
            break;
        }
    }

    data.writeData(DB)
    res.status(200).send("successfully updated!")
})

//delete

router.delete('/:id', (req, res) => {
    let DB = data.readData()
    let id = req.params.id

    let book = DB.book.find(e => e.id == id)
    if (!book) {
        res.status(400).send(`book id:${id} does not exist!`);
        return
    }

    DB.book = DB.book.filter(e => e.id != id)
    data.writeData(DB)
    res.status(200).send("successfully deleted!")
})

module.exports = { router }