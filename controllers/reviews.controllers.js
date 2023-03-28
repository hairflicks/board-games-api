
const {fetchReviewById, fetchAllReviews, fetchCommentByReviewId, placeCommentByReviewId, updateReviewLikes} = require('../models/reviews.models')
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
        res.status(200).send({comments})
    })
    .catch(next)
}

function patchReviewLikes(req, res, next) {
    const id = req.params.id
    const body = req.body
    updateReviewLikes(id, body)
    .then((updatedReview) => {
        res.status(200).send({updatedReview})
    })
    .catch(next)
}

module.exports = {getReviewById, getAllReviews, getCommentsByReviewId, postCommentByReviewId, patchReviewLikes}

