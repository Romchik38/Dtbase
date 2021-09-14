'use strict';

const libs = require('./dtlibs.js');

const dtbase = async obj => {
  try {
    const { methodName, fn, source, options } = obj;
    const method = libs.dtmethods[methodName];
    return await method(fn, source, options);
  } catch (err) {
    throw new Error(err);
  };

};

module.exports = dtbase;
