'use strict';

exports.compile = function(data) {
  const strings = data.strings;
  const values = data.values;

  let queryStrings = [];
  let queryValues = [];

  let stringBuffer = '';
  strings.forEach(function(string, index) {
    stringBuffer = stringBuffer.concat(string);

    const value = data.values[index];
    if (typeof value === 'object') {
      if ('table' in value) {
        stringBuffer = stringBuffer.concat(value.table);
      }
      else if ('columns' in value) {
        value.columns.forEach(function(column, columnIndex) {
          if (columnIndex === (value.columns.length - 1)) {
            stringBuffer = stringBuffer.concat('"' + column + '"');
          } else {
            stringBuffer = stringBuffer.concat('"' + column + '", ');
          }
        });
      }
      else if ('value' in value) {
        queryStrings.push(stringBuffer);
        queryValues.push(value.value);

        stringBuffer = '';
      }
    }
  });

  queryStrings.push(stringBuffer);

  return { strings: queryStrings, values: queryValues };
};
