'use strict';

const utils = require('./lib/utils');
const sql = require('./lib/sql');

module.exports = function() {
  const strings = utils.cleanStrings(arguments[0]);
  const values = new Array(arguments.length - 1);
  for (let index = 1; index <= values.length; ++index) {
    values[index - 1] = arguments[index];
  }

  const compiledQuery = sql.compile({ strings: strings, values: values });

  let queryFunction = function() {
    if (arguments.length !== compiledQuery.values.length) {
      throw new Error('Missing arguments for query. Expected ' + arguments.length + ' - Actual ' + compiledQuery.values.length);
    }

    let args = new Array(arguments.length);
    for (let index = 0; index < args.length; ++index) {
      args[index] = arguments[index];
    }

    let text = '';
    compiledQuery.strings.forEach(function(string, index) {
      if (compiledQuery.values[index]) {
        text = text.concat(string + '$' + (index + 1));
      } else {
        text = text.concat(string);
      }
    });

    return { text: text, values: args };
  };
  queryFunction._compiledQuery = compiledQuery;

  return queryFunction;
};
