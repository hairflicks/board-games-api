const express = require('express')


function customErrors(err,req,res,next) {
    console.log(err)
    if (err.status && err.msg) {

    res.status(err.status).send({msg: err.msg})
    } else next(err)
}

function psqlErrors(err,req,res,next) {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Invalid request type'})
    }
    else if (err.code === '42P01') {
        res.status(404).send({msg:'Table does not exist'})
    }
    else if (err.code === '23503') {
        res.status(404).send({msg: 'Entity does not exist in database'})
    }
    else if (err.code === "23502") {
        res.status(400).send({msg: "Missing required key/s"})
    }
    else next(err)
}

function serverError(err,req,res,next) {
    console.log(err)
    res.status(500).send({msg: 'Internal Server Error'})
}


module.exports = {serverError, customErrors, psqlErrors}

