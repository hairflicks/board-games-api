const db = require('../db/connection')

function fetchReviewById(id) {
    if (!/^\d+$/.test(id)) {
        return Promise.reject({status: 400, msg: `Invalid id request (${id})`})
    } else {
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
}

module.exports = {fetchReviewById}