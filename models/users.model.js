const db = require('../db/connection')

function fetchAllUsers() {
    return db.query(`SELECT * FROM users`)
    .then(({rows}) => {
        console.log(rows)
        return rows
    })
}

module.exports = {fetchAllUsers}