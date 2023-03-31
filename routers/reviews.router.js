const router = require('express').Router()
const {getReviewById, getAllReviews, getCommentsByReviewId, postCommentByReviewId, patchReviewLikes} = require('../controllers/reviews.controllers')

router.get


router.get('/:id', getReviewById)
router.get('/', getAllReviews)
router.post('/:id/comments', postCommentByReviewId)
router.get('/:id/comments', getCommentsByReviewId)
router.patch('/:id', patchReviewLikes)

module.exports = router

