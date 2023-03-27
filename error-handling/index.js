exports.serverError = (err,res,req,next) => {
    res.status(500).send({msg: 'Internal Server Error'})
}