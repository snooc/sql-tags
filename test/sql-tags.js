'use strict';

const assert = require('assert');
const sql = require('..');

describe('sql', function() {
  describe('template tag', function() {
    it('should return a compiled Query', function() {
      const query = sql`SELECT TRUE`;
      assert(typeof query, 'function');

      const qs = query();
      assert.equal(qs.text, 'SELECT TRUE');
      assert.deepEqual(qs.values, []);
    });
  });
});
