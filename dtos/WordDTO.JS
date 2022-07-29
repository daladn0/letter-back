module.exports = class WordDTO {
  word;
  definition;
  date;
  id;

  constructor(model) {
    this.word = model.word;
    this.definition = model.definition;
    this.date = model.date;
    this.id = model._id;
  }
};
