const router = require('express').Router();

const {getAllCategories, postCategory} = require('../controllers/categories.controllers')

router.get('/', getAllCategories)
router.post('/', postCategory)

module.exports = router