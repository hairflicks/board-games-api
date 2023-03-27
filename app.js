const {} = require('./controllers.js')
const express = require('express')

const app = express()

app.get('/api/categories', fn)

module.exports = app