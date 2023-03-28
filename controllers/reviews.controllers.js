const {fetchReviewById, fetchAllReviews, placeCommentByReviewId} = require('../models/reviews.models')

function getReviewById(req, res, next) {
    const id = req.params.id
    fetchReviewById(id)
    .then(review => {
        res.status(200).send({review})
    })
    .catch(next)
}

function getAllReviews(req, res, next) {
    fetchAllReviews()
    .then(reviews => {
        res.status(200).send({reviews})
    })
    .catch(next)
}

function postCommentByReviewId(req, res, next) {
    const id = req.params.id
    const comment = req.body
    placeCommentByReviewId(id, comment)
    .then(values => {
        const addedComment = values.rows
        console.log(addedComment)
        res.status(201).send({addedComment})
    })
    .catch(next)
}

module.exports = {getReviewById, getAllReviews, postCommentByReviewId}