'use strict';

const fs = require('fs');
const path = require('path');

const DIR_PATH = __dirname;
const delExt = fileName => path.parse(fileName)['name'];
const libs = Object.create(null);
const dirs = ['dtmethods', 'libs'];

for (const dir of dirs) {
  libs[dir] = Object.create(null);
  const names = fs.readdirSync(`${DIR_PATH}/${dir}`).map(delExt);
  for (const name of names) {
    const lib = require(`${DIR_PATH}/${dir}/${name}`);
    libs[dir][name] = lib;
  }
}

module.exports = libs;
