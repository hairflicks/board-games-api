const {getAllCategories} = require('./controllers/categories.controllers')
const {getReviewById} = require('./controllers/reviews.controllers')
const express = require('express')
const {serverError,customErrors} = require('./error-handling/index')

const app = express()

app.get('/api/categories', getAllCategories)
app.get('/api/reviews/:id', getReviewById)

app.use(customErrors)
app.use(serverError)


module.exports = app