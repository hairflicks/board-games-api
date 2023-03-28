
const {fetchReviewById, fetchAllReviews, fetchCommentByReviewId, placeCommentByReviewId} = require('../models/reviews.models')
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


function postCommentByReviewId(req, res, next) {
    const id = req.params.id
    const comment = req.body
    placeCommentByReviewId(id, comment)
    .then(addedComment => {
        res.status(201).send({addedComment})
    })
    .catch(next)
}

module.exports = {getReviewById, getAllReviews, postCommentByReviewId}

function getCommentsByReviewId(req, res, next) {
    const id = req.params.id
    const promises = [checkEntityExists('reviews','review_id', id), fetchCommentByReviewId(id)]
    Promise.all(promises)
    .then(commentList => {
        const comments = commentList[1]
        if (comments.length === 0) {
            return Promise.reject({status:200, msg: 'No comments for this review'})
        } else {
        res.status(200).send({comments})
        }
    })
    .catch(next)
}


module.exports = {getReviewById, getAllReviews, getCommentsByReviewId, postCommentByReviewId}

