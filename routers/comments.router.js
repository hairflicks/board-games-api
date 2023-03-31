const router = require('express').Router();
const { deleteCommentById, patchCommentVotes } = require('../controllers/comments.controllers')

router.delete('/:id', deleteCommentById )

router.patch('/:id', patchCommentVotes)

module.exports = router
