const {getAllCategories} = require('./controllers/categories.controllers')
const express = require('express')
const {} = require('./error-handling/index')

const app = express()

app.get('/api/categories', getAllCategories)



module.exports = app