'use strict';

const utils = require('./lib/utils');
const Query = require('./lib/query');

module.exports = function() {
  const strings = utils.cleanStrings(arguments[0]);
  const values = new Array(arguments.length - 1);
  for (let index = 1; index <= values.length; ++index) {
    values[index - 1] = arguments[index];
  }

  const query = utils.combineEveryOther(strings, values);
  return new Query(query).compile();
};
