const express = require('express')

const { db } = require('./Database/db')
const taskRoute = require('./Routes/tasks')
const noteRoute = require('./Routes/notes')

const app = express()

app.use(express.json())

app.use('/', express.static(__dirname + '/Public'))
app.use('/tasks', taskRoute)
app.use('/tasks', noteRoute)

db.sync()
  .then(() => {
    app.listen(process.env.PORT || 5001)
  })
  .catch((err) => {
    console.error(err)
  })