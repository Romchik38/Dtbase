'use strict';

const dtqueue = require('./dtqueue.js');

//Use this to insert without any condition
//Many dublicates is not a problem
const fn = function (item) {
  return item;
};
//Use this to insert with condirion - Name must be unique
//If not, you will get an error
const fnWithCond = function (item) {
  if (this.name !== item.name) return item;
}

const newData = { name: 'Viktor', age: 17 }

//methodName, fn, sourceName, options
dtqueue('insert', fnWithCond, 'users', { insert: newData})
  .then(data => {
    console.log({ data });
  })
  .catch(err => {
    console.log(err)
  });

//Error there, Viktor already present in the database
dtqueue('insert', fnWithCond, 'users', { insert: newData})
  .then(data => {
    console.log({ data });
  })
  .catch(err => {
    console.log(err)
  });
