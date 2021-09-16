'use strict';

const { readFile } = require('fs').promises;

const dtReadfile = (fileName, encoding = 'utf8') => new Promise((resolve, reject) => {
  if (fileName) {
    readFile(fileName, encoding)
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

module.exports = dtReadfile;
