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

function fetchAllReviews() {
    return db.query(`SELECT reviews.*, COUNT(comments.review_id) AS comment_count 
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC`)
    .then(({rows}) => {
         console.log(rows)
        return rows
    })
}

module.exports = {fetchReviewById, fetchAllReviews}