const router = require('express').Router()
const {getReviewById, getAllReviews, getCommentsByReviewId, postCommentByReviewId, patchReviewLikes, postReview, deleteReviewById} = require('../controllers/reviews.controllers')

router.get


router.get('/:id', getReviewById)
router.get('/', getAllReviews)
router.post('/:id/comments', postCommentByReviewId)
router.get('/:id/comments', getCommentsByReviewId)
router.patch('/:id', patchReviewLikes)
router.post('/', postReview)
router.delete('/:id', deleteReviewById)

module.exports = router

