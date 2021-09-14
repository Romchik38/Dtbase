'use strict';

const update = async (fn, arr, options) => {
  try {
    const obj = options.update;
    if (!obj) throw new Error('не передан объект для update');
    const bindedFn = fn.bind(obj);
    const res = [];
    for (const item of arr) {
      const value = bindedFn(item);
      if (value) {
        res.push(value);
      } else {
        throw new Error('Ошибка при update элемента: ', item);
      }
    }
    return res;
  } catch (err) {
    throw new Error(err);
  };
};

module.exports = update;
