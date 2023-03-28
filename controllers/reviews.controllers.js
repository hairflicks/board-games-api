const {fetchReviewById, fetchAllReviews, fetchCommentByReviewId} = require('../models/reviews.models')
const checkEntityExists = require('../models/utils.model')

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

function getCommentsByReviewId(req, res, next) {
    const id = req.params.id
    const promises = [checkEntityExists('reviews','review_id', id), fetchCommentByReviewId(id)]
    Promise.all(promises)
    .then(commentList => {
        const comments = commentList[1]
        res.status(200).send({comments})
    })
    .catch(next)
}


module.exports = {getReviewById, getAllReviews, getCommentsByReviewId}