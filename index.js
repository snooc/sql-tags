"use strict";

const dialect = "pg";

module.exports = function() {
  if (dialect === "pg") {
    return module.exports.pgSql.apply(arguments);
  }
  return module.exports.genericSql.apply(arguments);
};

module.exports.genericSql = function() {
  const text = arguments[0];

  let args = new Array(arguments.length - 1);
  for (let i = 0; i < args.length; ++i) {
    args[i] = arguments[i + 1];
  }

  return { text: text.join('?'), values: args };
};

module.exports.pgSql = function() {
  const text = cleanText(arguments[0]);

  let args = new Array(arguments.length - 1);
  for (let i = 0; i < args.length; ++i) {
    args[i] = arguments[i + 1];
  }

  let values = [];
  let newText = new String();
  text.forEach(function(fragment, index) {
    let argText = new String();
    if (typeof args[index] === "undefined") {

    }
    else if (typeof args[index] === "object") {
      if (typeof args[index]["table"] === "string") {
        argText = args[index]["table"];
      } else if (typeof args[index]["columns"] === "object") {
        args[index]["columns"].forEach(function(column, columnIndex) {
          if (columnIndex === 0) {
            argText = argText.concat("\"" + column + "\"");
          } else {
            argText = argText.concat(", \"" + column + "\"");
          }
        });
      }
    } else {
      values.push(args[index]);
      argText = "$" + values.length;
    }
    newText = newText.concat(fragment + argText);
  });

  return { text: newText, values: values };
}

function cleanText(text) {
  let newText = new Array(text.length);
  text.forEach(function(fragment, index) {
    newText[index] = fragment
      .split("\n")
      .map(function(fragment) {
        return fragment.replace(/^[ \\t]{2,}/gm, "");
      })
      .join(" ");
  });

  newText[0] = newText[0].replace(/^[ \\t]/gm, "");
  newText[newText.length - 1] = newText[newText.length - 1].replace(/[ \\t]$/gm, "");

  return newText;
}
