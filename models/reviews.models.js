const db = require('../db/connection')
const checkEntityExists = require('./utils.model')

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

function fetchAllReviews(queries) {
    const { category, sort_by, order, limit = 10 , p = 1 } = queries
    const params = []
    const validSortBy = ['comment_count', 'title', 'designer', 'review_body', 'category', 'votes', 'created_at']

    let sql = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count 
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id `

    if (category) {
        const spaceCategory = category.replaceAll('_', ' ')
        sql += `WHERE reviews.category = $1 `
        params.push(spaceCategory)
    }

    sql+= `GROUP BY reviews.review_id `

    if (sort_by) {
        if (validSortBy.includes(sort_by))
            sql+= `ORDER BY ${sort_by} `
        else {
            return Promise.reject({status:400, msg: 'Invalid sort_by query'})
        }
    } else {
        sql += `ORDER BY reviews.created_at `
    }

    if (order) {
        const capitalOrder = order.toUpperCase()
        if (capitalOrder != 'DESC' && capitalOrder != 'ASC') {
            return Promise.reject({status:400, msg:'Invalid order query'})
        }else {
            sql += `${capitalOrder}`
        }
    }else {
        sql += 'DESC'
    }

    if (isNaN(limit) && limit != 'all') {
        return Promise.reject({status:400, msg:'invalid limit query'})
    } else {
        sql += ` LIMIT ${limit}`
    }

    if (isNaN(p)) {
        return Promise.reject({status:400, msg:'Invalid page query'})
    } else if (limit != 'all') {
        sql += ` OFFSET ${(p - 1) * limit}`
    }

    let totalCountSql = `SELECT * FROM reviews`
    if (category) {
        totalCountSql += ` WHERE category = $1`
    }
    const promises = [db.query(sql, params),db.query(totalCountSql, params), checkEntityExists('categories', 'slug', params[0])]
    return Promise.all(promises)
    .then((results) => {
        const reviews = results[0].rows
        const total_count = results[1].rows.length
        return {reviews, total_count}
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

function fetchCommentByReviewId(id, queries) {
    const {limit = 10, p = 1} = queries
    let sql = `SELECT * FROM comments 
    WHERE review_id = $1
    ORDER BY created_at desc`

    if (isNaN(limit) && limit != 'all') {
        return Promise.reject({status:400, msg:'invalid limit query'})
    } else {
        sql += ` LIMIT ${limit}`
    }

    if (isNaN(p)) {
        return Promise.reject({status:400, msg:'Invalid page query'})
    } else if (limit != 'all') {
        sql += ` OFFSET ${(p - 1) * limit}`
    }

    return db.query(sql, [id])
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

function placeReview(review) {
    const params = [review.owner, review.title, review.review_body, review.designer, review.category]
    let sql = `INSERT INTO reviews (owner, title, review_body, designer, category`
    if (review.review_img_url) {
        sql += `, review_img_url) 
        VALUES ($1,
            $2,
            $3,
            $4,
            $5,
            $6) RETURNING *`
        params.push(review.review_img_url)
    }else {
        sql += `) VALUES ($1,
            $2,
            $3,
            $4,
            $5) RETURNING *` 
    }
    return db.query(sql, params)
    .then((values) => {
        const id = values.rows[0].review_id
    return db.query(`SELECT reviews.*, COUNT(comments.review_id) AS comment_count 
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = ${id} 
    GROUP BY reviews.review_id`)
    .then(values => {
        return values.rows[0]})
    })

}

function removeReviewById(id) {
    return db.query(`DELETE FROM reviews
                    WHERE review_id = $1
                    RETURNING * `, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Review ID does not exist'})
        }
    })
}


module.exports = {fetchReviewById, fetchAllReviews, fetchCommentByReviewId, placeCommentByReviewId, updateReviewLikes, placeReview, removeReviewById}

