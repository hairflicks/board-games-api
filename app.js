const {getAllCategories} = require('./controllers/categories.controllers')
const express = require('express')
const {serverError} = require('./error-handling/index')

const app = express()

app.get('/api/categories', getAllCategories)

app.use(serverError)


module.exports = app