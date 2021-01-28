'use strict';

const libs = require('./libs.js');

const dtbase = async obj => {
  try {
    const { methodName, fn, source, options } = obj;
    const method = libs.methods[methodName];
    return await method(fn, source, options);
  } catch (err) {
    throw new Error(err);
  };

};

module.exports = dtbase;
