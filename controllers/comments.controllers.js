const { removeCommentById, updateCommentVotes } = require('../models/comments.model')

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

function patchCommentVotes(req, res, next) {
    const id = req.params.id
    const count = req.body.inc_votes
    updateCommentVotes(id, count)
    .then(comment => {
        res.status(200).send({comment})
    })
    .catch(next)
}

module.exports = { deleteCommentById, patchCommentVotes }