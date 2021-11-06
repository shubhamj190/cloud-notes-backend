const connectTOMongo = require('./db')
connectTOMongo()
const express = require('express')
const app = express()
const port = 5000

// middleware
app.use(express.json())

//   avilable routes
app.use('/api/auth/createuser', require('./routes/auth'))
app.use('/api/notes/', require('./routes/notes'))

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })