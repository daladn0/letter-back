const ApiError = require('../exceptions/ApiError')
const WordModel = require('../models/Word.model')

class WordService {
    async getAll(query) {
        const page = parseInt(query.page) || 1
        const limit = parseInt(query.limit) || 10
        const offset = (page - 1) * limit

        const totalCount = await WordModel.countDocuments().exec()

        const sort = {}

        if ( query.sortBy && query.orderBy ) {
            sort[query.sortBy] = query.orderBy
        } else {
            sort.date = -1
        }

        const words = await WordModel.find().sort(sort).skip(offset).limit(limit)

        return {
            words,
            totalCount
        }
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
        const word = await WordModel.findOne({_id: id})

        if ( !word ) throw ApiError.BadRequest('There is no word with such an ID')

        await WordModel.deleteOne({_id: id})
    }
}

module.exports = new WordService()