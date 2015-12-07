'use strict';

const assert = require('assert');
const Query = require('../lib/query');

describe('Query', function() {
  describe('#compile()', function() {
    it('should return a query function', function() {
      const q = new Query([]).compile();
      assert.equal(typeof q, 'function');
    });
  });

  describe('#execute()', function() {
    it('should return query object', function() {
      const q = new Query([]).compile();
      assert(Object.keys(q()).indexOf('text') > -1);
      assert(Object.keys(q()).indexOf('values') > -1);
    });

    it('should compile strings', function() {
      const query = new Query(['SELECT', 'TRUE']);
      const q = query.compile();
      assert.deepEqual(query._compiledQuery, [
        { text: 'SELECT', values: [] },
        { text: 'TRUE', values: [] }
      ]);

      const qs = q();
      assert.equal(qs.text, 'SELECT TRUE');
      assert.deepEqual(qs.values, []);
    });

    it('should compile numbers into strings', function() {
      const query = new Query(['SELECT', 3]);
      const q = query.compile();
      assert.deepEqual(query._compiledQuery, [
        { text: 'SELECT', values: [] },
        { text: '3', values: [] }
      ]);

      const qs = q();
      assert.equal(qs.text, 'SELECT 3');
      assert.deepEqual(qs.values, []);
    });

    it('should compile arrays into comma seperated lists wrapped in quotes', function() {
      const query = new Query(['SELECT', ['id', 'email', 'password']]);
      const q = query.compile();
      assert.deepEqual(query._compiledQuery, [
        { text: 'SELECT', values: [] },
        { text: '"id", "email", "password"', values: [] }
      ]);

      const qs = q();
      assert.equal(qs.text, 'SELECT "id", "email", "password"');
      assert.deepEqual(qs.values, []);
    });

    it('should compile equals fragment into a paramaterized query', function() {
      const query = new Query([
        'SELECT * FROM foobar WHERE',
        { equalsFragment: { join: 'AND' } }
      ]);
      const q = query.compile();
      const qs = q({ email: 'foo@bar.com', active: true });
      assert.equal(qs.text, 'SELECT * FROM foobar WHERE "email" = $1 AND "active" = $2');
      assert.deepEqual(qs.values, ['foo@bar.com', true]);
    });

    it('should compile multiple equals fragment into a paramaterized query', function() {
      const query = new Query([
        'SELECT * FROM foobar WHERE',
        { equalsFragment: { join: 'AND' } },
        { equalsFragment: { join: 'AND' } }
      ]);
      const q = query.compile();
      const qs = q({ email: 'foo@bar.com', active: true });
      assert.equal(qs.text, 'SELECT * FROM foobar WHERE "email" = $1 AND "active" = $2 "email" = $3 AND "active" = $4');
      assert.deepEqual(qs.values, ['foo@bar.com', true, 'foo@bar.com', true]);
    });

    it('should compile equals fragment into empty string if no args', function() {
      const query = new Query([
        'SELECT * FROM foobar WHERE',
        { equalsFragment: { join: 'AND', whenEmpty: 'TRUE' } }
      ]);
      const q = query.compile();
      const qs = q();
      assert.equal(qs.text, 'SELECT * FROM foobar WHERE TRUE');
      assert.deepEqual(qs.values, []);
    });
  });
});
