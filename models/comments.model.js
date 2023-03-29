const db = require('../db/connection')

function removeCommentById(id) {
    return db.query(`DELETE FROM comments
                    WHERE comment_id = $1
                    RETURNING * `, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Comment ID does not exist'})
        }
    })
}

module.exports = { removeCommentById }