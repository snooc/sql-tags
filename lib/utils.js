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
