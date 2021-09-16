'use strict';

const update = async (fn, arr, options) => {
  try {
    const obj = options.update;
    if (!obj) throw new Error('Any object have not been passed to options.update');
    const bindedFn = fn.bind(obj);
    const res = [];
    for (const item of arr) {
      const value = bindedFn(item);
      if (value) {
        res.push(value);
      } else {
        throw new Error('Error while update item: ', item);
      }
    }
    return res;
  } catch (err) {
    throw new Error(err);
  };
};

module.exports = update;
