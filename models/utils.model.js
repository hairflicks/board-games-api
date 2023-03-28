const format = require('pg-format')
const db = require('../db/connection')


function checkEntityExists(table, column, value) {
    const sql = format('SELECT * FROM %I WHERE %I = $1', table, column)

    return db.query(sql, [value])
    .then((values) => {
        console.log(values.rows.length)
        if(values.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'Review id does not exist'})
        }
    })
}

module.exports = checkEntityExists