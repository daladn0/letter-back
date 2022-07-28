const ApiError = require('../exceptions/ApiError')
const WordModel = require('../models/Word.model')

class WordService {
    async getAll() {
        const words = await WordModel.find()
        return words
    }

    async create(word, definition, userId) {
        const wordData = await WordModel.create({ word, definition, user: userId })
        
        return wordData
    }

    async update(id, word, definition) {
        const foundWord = await WordModel.findById(id)

        if ( !foundWord ) throw ApiError.BadRequest('There is no word with such an ID')

        foundWord.word = word
        foundWord.definition = definition

        await foundWord.save()

        return foundWord
    }

    async delete(id) {
        console.log(id)
        const word = await WordModel.findOne({_id: id})

        if ( !word ) throw ApiError.BadRequest('There is no word with such an ID')

        await WordModel.deleteOne({_id: id})
    }
}

module.exports = new WordService()