const express = require('express')
const router = express.Router()

let data = require('./../data/data.js')

router.post('/', (req, res) => {
    let body = req.body
    let DB = data.readData()

    if (!body.fullname) {
        res.status(400).send("Fullname  is required!")
        return
    }
    if (!body.email) {
        res.status(400).send("Email  is required!")
        return
    }
    if (!body.dob) {
        res.status(400).send("Date of birth  is required!")
        return
    }
    if (!body.address) {
        res.status(400).send("Address  is required!")
        return
    }


    for (let i = 0; i < DB.customer.length; i++) {
        const element = DB.customer[i];
        if (element.id == body.id) {
            res.status(400).send(`id:${body.id} does not exists!`);
            return
        }
    }

    body.created_at = new Date()
    DB.customer.push(body)
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

    let list = DB.customer.filter(e => e.fullname.toLowerCase().includes(search.toLowerCase()))


    if (list.length == 0) {
        res.status(404).send("customer resource not found!")
        return
    }

    res.json(list)
})


router.get('/:id', (req, res) => {
    let DB = data.readData()
    let id = req.params.id

    let customer = DB.customer.find(e => e.id == id)
    if (!customer) {
        res.status(400).send(`customer id:${id} not found!`);
        return
    }

    res.status(200).json(customer)
})

//update

router.put('/', (req, res) => {
    let DB = data.readData()
    let body = req.body

    let customer = DB.customer.find(e => e.id == body.id)

    if (!customer) {
        res.status(400).send(`customer id:${body.id} does not exist!`);
        return
    }

    for (let i = 0; i < DB.customer.length; i++) {
        const element = DB.customer[i];
        if (element.id == body.id) {
            body.created_at = DB.customer[i].created_at
            body.updated_at = new Date()
            DB.customer[i] = body
            break;
        }
    }

    data.writeData(DB)
    res.status(200).send("successfully updated!")
})

//delete

router.delete('/:id', (req, res) => {
    let DB =  data.readData()
    let id = req.params.id

    let customer = DB.customer.find(e => e.id == id)
    if (!customer) {
        res.status(400).send(`customer id:${id} does not exist!`);
        return
    }

    DB.customer = DB.customer.filter(e => e.id != id)
    data.writeData(DB)

    res.status(200).send("successfully deleted!")
})

module.exports = { router }        