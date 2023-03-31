const router = require('express').Router();
const { deleteCommentById } = require('../controllers/comments.controllers')

router.delete('/:id', deleteCommentById )

module.exports = router
