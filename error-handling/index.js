const express = require('express')


function customErrors(err,req,res,next) {
    if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg})
    } else next(err)
}

function serverError(err,req,res,next) {
    res.status(500).send({msg: 'Internal Server Error'})
}

module.exports = {serverError, customErrors}