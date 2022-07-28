const { Schema, model } = require('mongoose')

const TokenSchema = new Schema({
    refreshToken: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
})

module.exports = model('Token', TokenSchema)