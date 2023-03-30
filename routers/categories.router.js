const router = require('express').Router();

const {getAllCategories} = require('../controllers/categories.controllers')

router.get('/', getAllCategories)

module.exports = {router}