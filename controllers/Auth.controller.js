const AuthService = require('../services/Auth.service')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/ApiError')

class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)

            if ( !errors.isEmpty() ) {
                throw ApiError.BadRequest('Invalid credentials', errors)
            }

            const { email, password } = req.body

            const userData = await AuthService.registration(email, password)

            return res.json({ message: "User has been created", user: userData });
        } catch(err) {
            next(err)
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req)

            if ( !errors.isEmpty() ) {
                throw ApiError.BadRequest('Invalid credentials', errors.errors)
            }

            const { email, password } = req.body

            const userData = await AuthService.login(email, password)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch(err) {
            next(err)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies

            await AuthService.logout(refreshToken)

            res.clearCookie('refreshToken')

            res.json({message: 'User is logged out'})
        } catch(err) {
            next(err)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies

            const userData = await AuthService.refresh(refreshToken)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            res.json(userData)
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new AuthController()