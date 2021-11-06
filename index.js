const connectTOMongo = require('./db')
connectTOMongo()
const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

//   avilable routes
app.use('/api/auth/', require('./routes/auth'))
app.use('/api/notes/', require('./routes/notes'))

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })