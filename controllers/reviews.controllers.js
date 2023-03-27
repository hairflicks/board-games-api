const {fetchReviewById, fetchAllReviews} = require('../models/reviews.models')

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


module.exports = {getReviewById, getAllReviews}