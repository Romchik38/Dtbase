'use strict';

const dtqueue = require('./dtqueue.js');

//For select and insert
const fnWithoutCond = function (item) {
  return item
};
//For delete
//Use this to delete with condition
const fnWithCond = function (item) {
  if (this.age !== item.age) return item;
}
//Data to insert
const newData = { name: 'Viktor', age: 17 }
//object with select condition
const dataToSelect = { age: 17 }
//object with delete condition
const dataToDelete = { age: 17 }

//START
//1 adding Viktor into table
dtqueue('insert', fnWithoutCond, 'users', { insert: newData})
  .then(data => {
    console.log({ data });
  })
  .catch(err => {
    console.log(err)
  });
//2 Make sure - Viktor here and feels good
dtqueue('select', fnWithoutCond, 'users', { select: dataToSelect })
  .then(data => {
    console.log({ data });
  })
  .catch(err => {
    console.log(err)
  });
//3 Deleting Viktor
dtqueue('delete', fnWithCond, 'users', { delete: dataToDelete})
  .then(data => {
    console.log({ data });
  })
  .catch(err => {
    console.log(err)
  });
//Thare are not any 17 years old Viktor in the databse
dtqueue('select', fnWithoutCond, 'users', { select: dataToSelect })
  .then(data => {
    console.log({ data });
  })
  .catch(err => {
    console.log(err)
  });
