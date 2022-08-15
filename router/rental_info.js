const express = require('express')
const router = express.Router()


let data = require('./../data/data.js')

//create
router.post('/:cid/:bid', (req, res) => {
    let DB = data.readData()
    let customer_id = parseInt(req.params.cid)
    let book_id = parseInt(req.params.bid)
    let body = req.body

    let customer = DB.customer.find(e => e.id == customer_id)
    if (!customer) {
        res.status(400).send(`Customer with ID:${customer_id} does not exist!`)
        return
    }
    let book = DB.book.find(e => e.id == book_id)
    if (!book) {
        res.status(400).send(`Book with ID:${book_id} does not exist!`)
        return
    }

    for (let i = 0; i < DB.rentalinfo.length; i++) {
        const element = DB.rentalinfo[i];
        if (element.customer_id == customer_id && element.book_id == book_id) {
            res.status(400).send(`Customer:${customer_id} already has been rented book:${book_id}!`);
            return
        }
    }
    let booked_day = body.booked_day
    let returned_day = body.returned_day


    //check book is returned or not
    for (let i = 0; i < DB.rentalinfo.length; i++) {
        const element = DB.rentalinfo[i];
        if (element.customer_id == customer_id && element.returned_day == "") {
            res.status(400).send(`Last book was not returned!`);
            return
        }
    }

    DB.rentalinfo.push({
        customer_id: customer_id,
        book_id: book_id,
        booked_day,
        returned_day,
        created_at: new Date()
    })
    data.writeData(DB)
    res.status(201).send("successfully created!")

})
//read
router.get('/:cid', (req, res) => {
    let DB = data.readData()
    let customer_id = parseInt(req.params.cid)
    let customer = DB.customer.find(e => e.id == customer_id)

    if (!customer) {
        res.status(400).send(`Customer with ID:${customer_id} does not exist!`);
        return
    }

    let BookList = DB.rentalinfo.filter(e => e.customer_id == customer_id)
    if (!BookList.length) {
        res.status(400).send(`Customer ID:${customer_id} didn't rent books`);
        return
    }

    BookList.forEach(e => {
        for (let i = 0; i < DB.book.length; i++) {
            if (e.book_id == DB.book[i].id) {
                e.book = DB.book[i]
                break
            }
        }
    });

    res.json({ rentalinfo: BookList, customer: customer })
    
})

router.get('/', (req, res) => {
    res.json(data.readData().rentalinfo)
})
//delete
router.delete('/:cid/:bid', (req, res) => {
    let customer_id = parseInt(req.params.cid)
    let book_id = parseInt(req.params.bid)

    let DB = data.readData()

    if (!customer_id) {
        res.status(400).send("Customer ID does not exist!");
        return
    }

    if (!book_id) {
        res.status(400).send("Book ID does not exist!");
        return
    }

    let rentalinfo = DB.rentalinfo.find(e => e.customer_id == customer_id && e.book_id == book_id)
    if (!rentalinfo) {
        res.status(400).send(`Customer:${customer_id} did not rent book:${book_id}!`);
        return
    }

    DB.rentalinfo = DB.rentalinfo.filter(e => e.customer_id != customer_id || e.book_id != book_id)
    data.writeData(DB)

    res.status(200).send("successfully deleted")
})


module.exports = router