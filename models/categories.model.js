const db = require('../db/connection')

function fetchAllCategories() {
    return db.query('SELECT * FROM categories')
    .then((categories) => {
        return categories.rows
    })
}

module.exports = {fetchAllCategories}