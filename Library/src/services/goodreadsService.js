const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');

// create a new parser
// by default it makes everything an Array so we're turning it off by passing in explicitArray
const parser = xml2js.Parser({ explicitArray: false });
function goodReadsService() {
  function getBookById() {
    return new Promise((resolve, reject) => {
      axios.get('https://www.goodreads.com/book/isbn/0441172717?key=nI2gPP83l99KN9WASYaXmw')
        .then((response) => { // If every thing works we get a response
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((err) => { // IF there is an error
          reject(err);
          debug(err);
        });
    });
  }

  return { getBookById };
}

module.exports = goodReadsService();
