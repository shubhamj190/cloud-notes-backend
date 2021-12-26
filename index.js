require('dotenv').config()
const connectTOMongo = require('./db')
connectTOMongo()
const express = require('express')
const app = express()
var cors = require('cors')
const port = prcess.env.PORT || 5000

// middleware
app.use(express.json())
app.use(cors())

//   avilable routes
app.use('/api/auth/', require('./routes/auth'))
app.use('/api/notes/', require('./routes/notes'))

  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
  })