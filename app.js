const PORT = 3000
const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is running')
})
/*let DB = {
    customer: [],
    book: [],
    rentalinfo: []
}
//module.exports = DB*/



const bookRouter = require('./router/book')
const customerRouter = require('./router/customer')
const rentalinfoRouter = require('./router/rental_info')

app.use('/book', bookRouter.router)
app.use('/customer', customerRouter.router)
app.use('/rentalinfo', rentalinfoRouter)




app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT)
})

