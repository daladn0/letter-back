const path = require('path')
const fs = require('fs')
const pdfmake = require("pdfmake");
const { Parser } = require("json2csv");
const ApiError = require("../exceptions/ApiError");
const WordModel = require("../models/Word.model");
const WordDTO = require("../dtos/WordDTO");

class WordService {
  async getAll(query, user) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalCount = await WordModel.countDocuments({ user }).exec();

    const sort = {};

    if (query.sortBy && query.orderBy) {
      sort[query.sortBy] = query.orderBy;
    } else {
      sort.date = -1;
    }

    const words = await WordModel.find({ user })
      .sort(sort)
      .skip(offset)
      .limit(limit);

    return {
      words,
      totalCount,
    };
  }

  async create(word, definition, userId) {
    const wordData = await WordModel.create({ word, definition, user: userId });

    return wordData;
  }

  async update(id, word, definition, user) {
    const foundWord = await WordModel.findOne({ _id: id, user });

    if (!foundWord)
      throw ApiError.BadRequest("There is no word with such an ID");

    foundWord.word = word;
    foundWord.definition = definition;

    await foundWord.save();

    return foundWord;
  }

  async delete(id, user) {
    const word = await WordModel.findOne({ _id: id, user });

    if (!word) throw ApiError.BadRequest("There is no word with such an ID");

    await WordModel.deleteOne({ _id: id });
  }

  async exportCSV(user) {
    try {
      const words = await WordModel.find({ user });

      const parser = new Parser();
      const csv = parser.parse(words.map((word) => new WordDTO(word)));

      return csv;
    } catch (err) {
      throw ApiError.BadRequest(
        "Something went wrong. Your words list is possibly empty"
      );
    }
  }

  async exportPDF(query, user) {
    try {
      const tableBody = [
        [{text: '', style: 'heading', border: [false, false, false, false]}, {text: '', style: 'heading', border: [false, false, false, false]}, {text: '', style: 'heading', border: [false, false, false, false]}, {text: '', style: 'heading', border: [false, false, false, false]}],
        [{text: '#', style: 'heading', border: [false, false, false, false]}, {text: 'Word/Phrase', style: 'heading', border: [false, false, false, false]}, {text: 'Definition/Translation', style: 'heading', border: [false, false, false, false]}, {text:'Date', style: 'heading', border: [false, false, false, false]}],
        [{text: '', style: 'heading', border: [false, false, false, false]}, {text: '', style: 'heading', border: [false, false, false, false]}, {text: '', style: 'heading', border: [false, false, false, false]}, {text: '', style: 'heading', border: [false, false, false, false]}],
      ]
      
      const sort = {}

      if (query.sortBy && query.orderBy) {
        sort[query.sortBy] = query.orderBy;
      } else {
        sort.date = -1;
      }

      const words = await WordModel.find({user}).sort(sort)

      let iteration = 1

      words.forEach( item => {
        const {word, definition, date} = new WordDTO(item)

        tableBody.push([{text: `${iteration}`, border: [false, false, false, false], style: 'cell'}, {text: `${word || '-'}`, border: [false, false, false, false], style: 'cell'}, {text: `${definition || '-'}`, border: [false, false, false, false], style: 'cell'}, {text: `${date}`, border: [false, false, false, false], style: 'cell'}])
      
        iteration++
      } )

      const pdf = await WordService.generatePDF(tableBody)
      
      return pdf
    } catch (err) {
      console.log(err)
      throw ApiError.BadRequest(
        "Something went wrong."
      );
    }
  }

  static async generatePDF(body) {
    try {
      const fonts = {
        Roboto: {
          normal: path.resolve(__dirname, '..', 'pdfmake', 'examples', 'fonts', 'Roboto', 'Roboto-Regular.ttf'),
          bold: path.resolve(__dirname, '..', 'pdfmake', 'examples', 'fonts', 'Roboto', 'Roboto-Medium.ttf'),
          italics: path.resolve(__dirname, '..', 'pdfmake', 'examples', 'fonts','Roboto', 'Roboto-Italic.ttf'),
          bolditalics: path.resolve(__dirname, '..', 'pdfmake', 'examples', 'fonts', 'Roboto', 'Roboto-MediumItalic.ttf')
        }
      };
  
      pdfmake.setFonts(fonts)
  
      const pdf = pdfmake.createPdf({
        content: [
        {
            text: 'Letter App',
            alignment: 'center',
              margin: [0, 0, 0, 20],
              fontSize: 24,
              color: '#333',
              bold: true,
        },
        {
            text: 'Visit out website: ',
            style: 'adHeading'
        },
        {
            link: 'https://google.com/',
            text: 'google.com/',
            style: 'adLink',
        },
          {
            layout: {
              fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex % 2 === 0) ? '#fff' : '#f1f5f9';
            },
            }, // optional
            table: {
              headerRows: 3,
              widths: [ '10%', '40%', '40%', '15%' ],
      
              body: body
            }
          },
        ],
        styles: {
              adHeading: {
                  fontSize: 10,
                  margin: [0, 0, 0, 5],
                  color: '#333',
                  bold: true,
              },
              adLink: {
                  fontSize: 10,
                  margin: [0, 0, 0, 10],
                  italics: true,
                  color: '#2570fa',
              },
          heading: {
              fillColor: '#2563eb',
            fontSize: 12,
            bold: true,
            color: '#fff',
          },
          cell: {
              fontSize: 10,
              color: '#333',
          }
        },
      });
      
      return pdf.getDataUrl();
    } catch(err) {
      throw err
    }
  }
}

module.exports = new WordService();
