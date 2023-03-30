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

function updateCommentVotes(id, count) {
    if (count) {
        return db.query(`UPDATE comments
                        SET votes = votes + $2
                        WHERE comment_id = $1
                        RETURNING *`, [id,count])
        .then((result) => {
            console.log(result)
            if (result.rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Comment_id does not exist'})
            } else {
                return result.rows[0]
            }
        })
        } else {
            return Promise.reject({status: 400, msg: 'Please provide inc_votes key'})
        }
}


module.exports = { removeCommentById, updateCommentVotes }