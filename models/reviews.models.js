const db = require('../db/connection')

function fetchReviewById(id) {
    const params = [id]
    return db.query(
        `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id`, params)
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
        return rows
    })
}


function placeCommentByReviewId(id, comment) {
    const author = comment.username
    const body = comment.body
    const params = [id, author, body]
    if (author && body) {
    return db.query(`INSERT INTO comments (review_id, author, body)
                    VALUES ($1,
                            $2,
                            $3)
                            RETURNING *`, params)
    .then((values) => {
    return values.rows[0]})
    } else {
        return Promise.reject({status: 400, msg: 'Object missing required keys'})
    }
}

function fetchCommentByReviewId(id) {
    return db.query(`SELECT * FROM comments 
                    WHERE review_id = $1
                    ORDER BY created_at desc`, [id])
    .then((comments) => {
        if (comments.rows.length === 0) {
            return Promise.reject({status:200, msg: 'No comments for this review'})
        } else {
        return comments.rows
        }
    })
}

function updateReviewLikes(id, count) {
    if (count) {
    return db.query(`UPDATE reviews
                    SET votes = votes + $2
                    WHERE review_id = $1
                    RETURNING *`, [id,count])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Review_id does not exist'})
        } else {
            return result.rows[0]
        }
    })
    } else {
        return Promise.reject({status: 400, msg: 'Please provide inc_votes key'})
    }
}

module.exports = {fetchReviewById, fetchAllReviews, fetchCommentByReviewId, placeCommentByReviewId, updateReviewLikes}

