const db = require('../db/connection')

function fetchAllUsers() {
    return db.query(`SELECT * FROM users`)
    .then(({rows}) => {
        return rows
    })
}

function fetchUserByUsername(username) {
    return db.query(`SELECT * FROM users
                    WHERE username = $1`, [username])
    .then(result => {return result.rows[0]})
}

module.exports = {fetchAllUsers, fetchUserByUsername}