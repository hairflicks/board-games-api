const router = require('express').Router();
const getAllUsers  = require('../controllers/users.controllers')

router.get('/', getAllUsers)

module.exports = router
