const ApiError = require("../exceptions/ApiError")

module.exports = (err, req, res, next) => {
    console.log(err)

    if ( err instanceof ApiError ) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }

    res.status(500).send({message: 'Something went wrong'})
}