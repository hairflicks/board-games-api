const { fetchAllUsers, fetchUserByUsername } = require('../models/users.model')
const checkEntityExists = require('../models/utils.model')

function getAllUsers(req, res, next) {
    fetchAllUsers()
    .then(users => {
        res.status(200).send({users})
    })
    .catch(err => {
        next(err)
    })
}

function getUserByUsername(req, res, next) {
    const {username} = req.params
    const promises = [checkEntityExists('users','username', username), fetchUserByUsername(username)]
    Promise.all(promises)
    .then(result => {
        const user = result[1]
        res.status(200).send({user})
    })
    .catch(next)
}

module.exports = {getAllUsers, getUserByUsername}