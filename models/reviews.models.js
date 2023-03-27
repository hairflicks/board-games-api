const db = require('../db/connection')

function fetchReviewById(id) {
    const params = [id]
    return db.query(
        `SELECT * FROM reviews 
        WHERE review_id = $1`, params)
    .then(({rows}) => {
        if (rows.length === 0) {
           return Promise.reject({status: 404, msg: `No review found for ID:${id}`})
        }
        else {
        return rows
        }
    })
}

module.exports = {fetchReviewById}