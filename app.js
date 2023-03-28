const {getAllCategories} = require('./controllers/categories.controllers')
const {getReviewById, getAllReviews, postCommentByReviewId} = require('./controllers/reviews.controllers')
const express = require('express')
const {serverError,customErrors,invalidInputTypeError} = require('./error-handling/errorcontrollers')

const app = express()

app.use(express.json())

app.get('/api/categories', getAllCategories)
app.get('/api/reviews/:id', getReviewById)
app.get('/api/reviews', getAllReviews)
app.post('/api/reviews/:id/comments', postCommentByReviewId)

app.use(customErrors)
app.use(invalidInputTypeError)
app.use(serverError)


module.exports = app