'use strict';

const del = async (fn, arr, options) => {
  try {
    const obj = options.delete;
    if (!obj) throw new Error('Any object have not been passed to options.delete');
    const bindedFn = fn.bind(obj);
    const res = [];
    for (const item of arr) {
      const value = bindedFn(item);
      if (value) {
        res.push(value);
      } 
    }
    return res;
  } catch (err) {
    throw new Error(err);
  };
};

module.exports = del;
