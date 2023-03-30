const { removeCommentById } = require('../models/comments.model')

function deleteCommentById(req, res, next) {
    const id = req.params.id
    removeCommentById(id)
    .then(() => {
        res.sendStatus(204) 
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { deleteCommentById }