const connectToMongo = require('./db');
const express = require('express');
const { Routes } = require('react-router-dom');
var cors = require('cors')


connectToMongo()
const app = express()
const port = 5000
app.use(cors())
app.use(express.json()) 
// app.get('/', (req, res) => {
//   res.send('Hello Suraj!')
// })

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
  
app.listen(port, () => {
  console.log(`iNotebook backend app listening on port ${port}`)
})
