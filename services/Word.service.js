const fs = require('fs')
const ApiError = require('../exceptions/ApiError')
const WordModel = require('../models/Word.model')
const WordDTO = require('../dtos/WordDTO')
const { Parser } = require('json2csv');

class WordService {
    async getAll(query, user) {
        const page = parseInt(query.page) || 1
        const limit = parseInt(query.limit) || 10
        const offset = (page - 1) * limit

        const totalCount = await WordModel.countDocuments({user}).exec()

        const sort = {}

        if ( query.sortBy && query.orderBy ) {
            sort[query.sortBy] = query.orderBy
        } else {
            sort.date = -1
        }

        const words = await WordModel.find({user}).sort(sort).skip(offset).limit(limit)

        return {
            words,
            totalCount
        }
    }

    async create(word, definition, userId) {
        const wordData = await WordModel.create({ word, definition, user: userId })
        
        return wordData
    }

    async update(id, word, definition, user) {
        const foundWord = await WordModel.findOne({_id: id, user})

        if ( !foundWord ) throw ApiError.BadRequest('There is no word with such an ID')

        foundWord.word = word
        foundWord.definition = definition

        await foundWord.save()

        return foundWord
    }

    async delete(id, user) {
        const word = await WordModel.findOne({_id: id, user})

        if ( !word ) throw ApiError.BadRequest('There is no word with such an ID')

        await WordModel.deleteOne({_id: id})
    }

    async exportCSV(user) {
        try {
            const words = await WordModel.find({user})

            const parser = new Parser();
            const csv = parser.parse(words.map( word => new WordDTO(word) ));

            return csv
        } catch(err) {
            throw ApiError.BadRequest('Something went wrong. Your words list is possibly empty')
        }
    }
}

module.exports = new WordService()