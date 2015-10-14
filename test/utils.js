'use strict';

const assert = require('assert');
const utils = require('../lib/utils');

describe('utils', function() {
  describe('#cleanTemplate()', function() {
    it('should strip all tabs, newlines and multi-spaces from single line strings', function() {
      const stringsVariants = [
        ['this is a test'],
        [' this is a test'],
        ['     this is a test'],
        ['this is a test '],
        ['this is a test        '],
        ['\tthis is a test'],
        ['\t\tthis is a test'],
        ['this is    a test\t'],
        ['this is a test\t\t'],
        ['\tthis is a \ntest\t'],
        ['\n\n\t this is    a \ntest      '],
        ['\nthis          is a \n      test\t']
      ];
      stringsVariants.forEach(function(strings, index) {
        assert.deepEqual(utils.cleanStrings(strings), ['this is a test']);
      });
    });

    it('should strip all tabs, newlines and multi-spaces from multiple line strings', function() {
      const leadingStringsVariants = [
        ['', 'this is a test'],
        ['', 'this is a test'],
        ['\n\n', 'this is a test'],
        ['\t\n', 'this\t\t    is a test']
      ];
      leadingStringsVariants.forEach(function(strings, index) {
        assert.deepEqual(utils.cleanStrings(strings), ['', 'this is a test']);
      });

      const trailingStringsVariants = [
        ['this is a test', ''],
        ['this\n is a test', '     '],
        ['this is a\t\n\n\n test', '\n\t']
      ];
      trailingStringsVariants.forEach(function(strings, index) {
        assert.deepEqual(utils.cleanStrings(strings), ['this is a test', '']);
      });

      const havingStringsVariants = [
        ['this is a test      ', ''],
        ['this\n is a test  \n\n', '     '],
        ['this is a\t\n\n\n test ', '\n\t']
      ];
      havingStringsVariants.forEach(function(strings, index) {
        assert.deepEqual(utils.cleanStrings(strings), ['this is a test ', '']);
      });
    });
  });
});
