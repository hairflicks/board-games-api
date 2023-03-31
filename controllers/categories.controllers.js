const {fetchAllCategories, placeCategory} = require('../models/categories.model')


function getAllCategories(req, res, next) {
    fetchAllCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch(err => {
        next(err)
    })
}

function postCategory(req, res, next) {
    const category = req.body
    placeCategory(category) 
    .then((category) => {
        res.status(201).send({category})
    })
    .catch(next)
}

module.exports = {getAllCategories, postCategory}