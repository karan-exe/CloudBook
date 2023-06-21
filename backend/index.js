const connectToMongo = require('./db');
connectToMongo();

const express = require('express')
const app = express()
var cors = require('cors')
const port = 5000
app.use(cors())
app.use(express.json())
app.get("/", (req, res) => {
    res.send("Hello Karan")
})
app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})