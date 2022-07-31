const formatDate = require('../utils/formatDate')

module.exports = class WordDTO {
  word;
  definition;
  date;

  constructor(model) {
    this.word = model.word;
    this.definition = model.definition;
    this.date = formatDate(model.date);
  }
};
