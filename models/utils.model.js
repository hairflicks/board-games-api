const format = require('pg-format')
const db = require('../db/connection')


function checkEntityExists(table, column, value) {
    const sql = format('SELECT * FROM %I WHERE %I = $1', table, column)
    if (value) {
    return db.query(sql, [value])
    .then((values) => {
        if(values.rowCount === 0) {
            return Promise.reject({status: 404, msg: `${value} does not exist`})
        }
    })
    } else {
        return Promise.resolve
    }
}

module.exports = checkEntityExists