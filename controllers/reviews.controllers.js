const {fetchReviewById} = require('../models/reviews.models')

function getReviewById(req, res, next) {
    const id = req.params.id
    fetchReviewById(id)
    .then(review => {
        res.status(200).send({review})
    })
    .catch(next)
}


module.exports = {getReviewById}