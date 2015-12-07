'use strict';

exports.cleanStrings = function(strings) {
  let cleanStrings = new Array(strings.length);

  strings.forEach(function(string, index) {
    let cleanString = string
      // Remove any tabs.
      .replace(/\t|\n/g, '')
      // Replace any spaces greater than 1 with 1 space.
      .replace(/[ ]{2,}/g, ' ');

    if (index == 0) {
      // Remove leading spaces if first string.
      cleanString = cleanString.replace(/^[ ]*/g, '')
    }

    if (index == (strings.length - 1)) {
      // Remove trailing spaces if last string.
      cleanString = cleanString.replace(/[ ]*$/g, '');
    }

    cleanStrings[index] = cleanString;
  });

  return cleanStrings;
};

exports.combineEveryOther = function(a1, a2) {
  const size = ((a1.length < a2.length) ? a1.length : a2.length);

  let result = new Array();
  let a1Pos = 0;
  let a2Pos = 0;
  for (let i = 0; i < size * 2; i++) {
    if (i % 2 === 0) {
      result.push(a1[a1Pos]);
      a1Pos++;
    } else {
      result.push(a2[a2Pos]);
      a2Pos++;
    }
  }

  if (a1.length != a2.length) {
    if (a1.length > a2.length) {
      result = result.concat(a1.slice(size));
    } else {
      result = result.concat(a2.slice(size));
    }
  }

  return result;
}
