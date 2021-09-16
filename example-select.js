'use strict';

const dtqueue = require('./dtqueue.js');

const fn = function (item) {
  if (this.name === item.name) return item
};

//methodName, fn, sourceName, options
dtqueue('select', fn, 'users', { select: { name: 'Ivan' }})
  .then(data => {
    console.log({ data });
  })
  .catch(err => {
    console.log(err)
  });
