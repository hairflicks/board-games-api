const {getAllCategories} = require('./controllers/categories.controllers')
const {getReviewById, getAllReviews, getCommentsByReviewId} = require('./controllers/reviews.controllers')
const express = require('express')
const {serverError,customErrors,psqlErrors} = require('./error-handling/errorcontrollers')

const app = express()

app.get('/api/categories', getAllCategories)
app.get('/api/reviews/:id', getReviewById)
app.get('/api/reviews', getAllReviews)
app.get('/api/reviews/:id/comments', getCommentsByReviewId)

app.use(customErrors)
app.use(psqlErrors)
app.use(serverError)


module.exports = app
