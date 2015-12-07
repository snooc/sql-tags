'use strict';

class Query {
  constructor(query) {
    this._query = query;
  }

  compile() {
    this._compiledQuery = new Array();

    this._query.forEach((el) => {
      const currPos = this._compiledQuery.length - 1;

      if (typeof el === 'string' || typeof el === 'number') {
        this._compiledQuery.push(this._compileStringEl(el));
      } else if (typeof el === 'object') {
        if (Array.isArray(el)) {
          this._compiledQuery.push(this._compileArrayEl(el));
        } else {
          this._compiledQuery.push(this._compileObjectEl(el));
        }
      } else if (typeof el === 'function') {
        this._compiledQuery.push(el);
      } else {
        throw new Error('Query Compilation Error: Unknown element type \'', typeof el, '\'');
      }
    });

    return this.execute.bind(this);
  }

  _compileStringEl(el) {
    return {
      text: el.toString(),
      values: []
    };
  }

  _compileArrayEl(el) {
    return {
      text: el.map((item) => '"' + item.toString() + '"').join(', '),
      values: []
    };
  }

  _compileObjectEl(el) {
    if (Object.keys(el).indexOf('equalsFragment') > -1) {
      return this._compileEqualsFragment(el.equalsFragment);
    }

    throw new Error('Query Compilation Error: Unknown object type');
  }

  _compileEqualsFragment(fragment) {
    return (function(args, paramIndexStart) {
      if (typeof paramIndexStart === 'undefined') {
        paramIndexStart = 1;
      }

      const join = fragment.join;
      const whenEmpty = fragment.whenEmpty;

      const argKeys = Object.keys(args);
      if (argKeys.length === 0) {
        if (typeof whenEmpty === 'undefined') {
          throw new Error('Query Execution Error: Missing whenEmpty args');
        }

        return {
          text: whenEmpty,
          values: []
        };
      }

      // If join was 'AND' and we had args { email: 'foo@bar.com', active: true }, then this would return
      // ==> '"email" = $1 AND "active" = $2'
      const text = argKeys.reduce((prev, curr, index, argKeys) => {
        return prev +
          (index === 0 ? '' : ' ') + '"' +
          argKeys[index] + '"' + ' = ' + '$' + (paramIndexStart + index) +
          (index === argKeys.length - 1 ? '' : ' ' + join);
      }, '');
      const values = argKeys.map(key => args[key]);

      return {
        text: text,
        values: values
      };
    });
  }

  execute(args) {
    args = args || {};

    let text = '';
    let values = [];

    this._compiledQuery.forEach(function(item, index) {
      if (typeof item === 'function') {
        item = item(args, values.length + 1);
      }

      text = text.concat(index === 0 ? '' : ' ', item.text);
      values = values.concat(item.values);
    });

    return {
      text: text,
      values: values
    };
  }
}

module.exports = Query;
