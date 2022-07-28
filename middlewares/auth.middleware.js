const ApiError = require('../exceptions/ApiError')
const TokenService = require('../services/Token.service')

module.exports = (req, res, next) => {
    try {
        const { authorization } = req.headers

        if ( !authorization ) {
            next(ApiError.UnauthorizedError())
        }

        const token = authorization.split(' ')[1]

        if ( !token ) {
            next(ApiError.UnauthorizedError())
        }

        const tokenData = TokenService.validateAccessToken(token)

        if ( !tokenData ) {
            next(ApiError.UnauthorizedError())
        }

        req.user = tokenData

        next()
    } catch(e) {
        next(e)
    }
}