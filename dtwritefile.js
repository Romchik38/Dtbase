'use strict';

const { writeFile } = require('fs').promises;

const dtWritefile = (fileName, data, encoding) => new Promise((resolve, reject) => {
  if (fileName) {
    writeFile(fileName, data, encoding)
      .then(data => {
        resolve(data);
      }, err => {
        reject(err);
      }).catch(err => {
        reject(err);
      })
  } else {
    reject('не передано имя файла')
  }
});

module.exports = dtWritefile;
