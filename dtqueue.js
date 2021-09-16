'use strict';

const dtbase = require('./dtbase.js');
const { libs } = require('./dtlibs.js');
const readFile = libs.dtreadfile;
const writeFile = libs.dtwritefile;
const Queue = libs.concurrentQueueThenable;

const dtPath = __dirname.concat('/database/');

const updateInsert = (data, sourceName) => new Promise((resolve, reject) => {
  const str = JSON.stringify(data);
  const filePath = `${dtPath}${sourceName}.json`;
  writeFile(filePath, str)
    .then(response => {
      resolve('ok');
    }).catch(err => {
      reject(err);
    });
});

const methodSerializer = {
  select: data => Promise.resolve(data),
  update: updateInsert,
  insert: updateInsert,
};

const job = async (element, callback) => {
  const { task, thenable } = element;
  const { methodName, fn, sourceName, options } = task;
  readFile(`${dtPath}${sourceName}.json`)
    .then(data => {
      if(data) {
        const parsedData = JSON.parse(data);
        const opt = {
          methodName,
          fn,
          source: parsedData,
          options
        };
        dtbase(opt)
          .then(data => {
            //работаем с данными
            const serializedMethod = methodSerializer[methodName];
            serializedMethod(data, sourceName)
              .then(data => {
                if (data) {
                  callback(null, { data, thenable });
                } else {
                  callback(err, { thenable });
                }
              }).catch(err => {
                callback(err, { thenable });
              })
          }, err => {
            //работаем с ошибками
            //console.log(err);
            callback(err, { thenable });
          }).catch(err => {
            //работаем с ошибками
            callback(err, { thenable });
            //console.log(err);
          })
      }
    }, err => {
      //работаем с ошибками
      //console.log(err);
      callback(err, { thenable });
    }).catch(err => {
      //работаем с ошибками
      callback(err, { thenable });
      //console.log(err);
    })
};

const q1 = new Queue(1)
  .process(job)
//  .wait(4000)
//  .timeout(5000)
  .success(result => {
    const { thenable, data } = result;
    thenable.resolve(data);
  })
  .failure((err, data) => {
    const { thenable } = data;
      thenable.reject(err);
  });

const dtqueue = (methodName, fn, sourceName, options) => new Promise((resolve, reject) => {
  q1.add({ methodName, fn, sourceName, options })
    .then(result => {
      //working with result
      resolve(result);
    }, err => {
      //working with err
      reject(err);
    });
});

module.exports = dtqueue;
