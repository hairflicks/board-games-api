const endpoints = require('./endpoints')
const express = require('express')
const {serverError,customErrors,psqlErrors} = require('./error-handling/errorcontrollers')
const { categoriesRouter, commentsRouter, reviewsRouter, usersRouter } = require('./routers/index.js')

const app = express()

app.use(express.json())

app.get('/api', (req,res) => {
    res.status(200).send(endpoints)
})

app.use('/api/categories', categoriesRouter)

app.use('/api/users', usersRouter)

app.use('/api/reviews', reviewsRouter)

app.use('/api/comments', commentsRouter)

app.use(customErrors)
app.use(psqlErrors)
app.use(serverError)


module.exports = app
