const {fetchAllCategories} = require('../models/categories.model')


function getAllCategories(req, res, next) {
    fetchAllCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
}

module.exports = {getAllCategories}