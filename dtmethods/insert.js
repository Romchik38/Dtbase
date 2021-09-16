'use strict';

const insert = async (fn, arr, options) => {
  try {
    const obj = options.insert;
    if (!obj) throw new Error('Any object have not been passed to options.insert');
    const bindedFn = fn.bind(obj);
    const res = [];
    for (const item of arr) {
      const value = bindedFn(item);
      if (value) {
        res.push(value);
      } else {
        throw new Error(`Error insert item: ${item} is a duplicate`);
      }
    }
    res.push(obj);
    return res;
  } catch (err) {
    throw new Error(err);
  };
};

module.exports = insert;
