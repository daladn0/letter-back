const jwt = require('jsonwebtoken')
const TokenModel = require('../models/Token.model')

class TokenService {
    validateAccessToken(token) {
        try {
            const tokenPayload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return tokenPayload
        } catch(e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const tokenPayload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return tokenPayload
        } catch(e) {
            return null
        }
    }
 
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({user: userId})

        if ( tokenData ) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        return await TokenModel.create({user: userId, refreshToken})
    }

    async deleteToken(refreshToken) {
        await TokenModel.deleteOne({refreshToken})
    }

    async findToken(refreshToken) {
        const token = await TokenModel.findOne({refreshToken})
        return token
    }
}

module.exports = new TokenService()