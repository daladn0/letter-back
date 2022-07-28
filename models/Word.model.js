const { model, Schema, Schema: { Types: { ObjectId } } } = require('mongoose')

const WordSchema = new Schema({
    word: { type: String, default: '' },
    definition: { type: String, default: '' },
    date: { type: Date, default: Date.now() },
    user: { type: ObjectId, ref: 'User' }
})

module.exports = model('Word', WordSchema)