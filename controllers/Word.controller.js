const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/ApiError");
const WordService = require("../services/Word.service");

class WordController {
  async getAll(req, res, next) {
    try {
      const words = await WordService.getAll();
      res.json(words);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { word = '', definition = '' } = req.body;

      const wordData = await WordService.create(word, definition, req.user.id);

      res.json(wordData);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {

      const { id } = req.params;
      const { word = '', definition = '' } = req.body;

      const wordData = await WordService.update(id, word, definition);
      res.json(wordData);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw ApiError.BadRequest("ID is not provided");
      }

      await WordService.delete(req.params.id);

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new WordController();
