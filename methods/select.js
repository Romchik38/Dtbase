'use strict';

const select = async (fn, arr) => {
  try {
    const res = [];
    for (const item of arr) {
      const value = await fn(item);
      if (value) res.push(value);
    }
    return res;
  } catch (err) {
    throw new Error(err);
  };

};

module.exports = select;
