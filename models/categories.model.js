const db = require('../db/connection')

function fetchAllCategories() {
    return db.query('SELECT * FROM categories')
    .then((categories) => {
        return categories.rows
    })
}

function placeCategory(category) {
    const params = [category.slug, category.description]
    if (category.slug && category.description) {
    return db.query(`INSERT INTO categories (slug, description)
                    VALUES ($1, $2)
                    RETURNING *`, params)
    .then(result => {return result.rows[0]})
    } else {
        return Promise.reject({status:400, msg:'Missing keys from object'})
    }
}




module.exports = {fetchAllCategories, placeCategory}