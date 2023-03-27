const express = require('express')


function customErrors(err,req,res,next) {
    if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg})
    } else next(err)
}

function invalidInputTypeError(err,req,res,next) {
    console.log(err.code)
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Invalid request type'})
    }
    else if (err.code === '42P01') {
        res.status(404).send({msg:'Table does not exist'})
    }
    else next(err)
}
function serverError(err,req,res,next) {
    console.log(err)
    res.status(500).send({msg: 'Internal Server Error'})
}

module.exports = {serverError, customErrors, invalidInputTypeError}