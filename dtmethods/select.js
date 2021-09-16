'use strict';

const select = async (fn, arr, options) => {
  try {
    const obj = options.select;
    if (!obj) throw new Error('Any object have not been passed to options.select');
    const bindedFn = fn.bind(obj);
    const res = [];
    for (const item of arr) {
      const value = await bindedFn(item);
      if (value) res.push(value);
    }
    return res;
  } catch (err) {
    throw new Error(err);
  };

};

module.exports = select;
