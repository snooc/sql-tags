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

    describe('Constants', function() {
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
    });

    describe('Fragment: equals', function() {
      it('should compile equals fragment into a paramaterized query', function() {
        const query = new Query([
          'SELECT * FROM foobar WHERE',
          { equals: { join: 'AND' } }
        ]);
        const q = query.compile();
        const qs = q({ email: 'foo@bar.com', active: true });
        assert.equal(qs.text, 'SELECT * FROM foobar WHERE "email" = $1 AND "active" = $2');
        assert.deepEqual(qs.values, ['foo@bar.com', true]);
      });

      it('should compile equals fragment with skip into a paramaterized query', function() {
        const query = new Query([
          'UPDATE foobar', 'SET',
          { equals: { join: ',', skip: ['id'] } },
          'WHERE id = 4'
        ]);
        const q = query.compile();
        const qs = q({ id: 4, email: 'foo@bar.com', active: true });
        assert.equal(qs.text, 'UPDATE foobar SET "email" = $1 , "active" = $2 WHERE id = 4');
        assert.deepEqual(qs.values, ['foo@bar.com', true]);
      });

      it('should compile multiple equals fragment into a paramaterized query', function() {
        const query = new Query([
          'SELECT * FROM foobar WHERE',
          { equals: { join: 'AND' } },
          { equals: { join: 'AND' } }
        ]);
        const q = query.compile();
        const qs = q({ email: 'foo@bar.com', active: true });
        assert.equal(qs.text, 'SELECT * FROM foobar WHERE "email" = $1 AND "active" = $2 "email" = $3 AND "active" = $4');
        assert.deepEqual(qs.values, ['foo@bar.com', true, 'foo@bar.com', true]);
      });

      it('should compile equals fragment into empty string if no args', function() {
        const query = new Query([
          'SELECT * FROM foobar WHERE',
          { equals: { join: 'AND', whenEmpty: 'TRUE' } }
        ]);
        const q = query.compile();
        const qs = q();
        assert.equal(qs.text, 'SELECT * FROM foobar WHERE TRUE');
        assert.deepEqual(qs.values, []);
      });

      it('should throw an Error if empty args and no empty state given', function() {
        const query = new Query([
          'SELECT * FROM foobar WHERE',
          { equals: { join: 'AND' } }
        ]);
        const q = query.compile();
        assert.throws(function() {
          const qs = q();
        }, /Empty/);
      });
    });

    describe('Fragment: value', function() {
      it('should compile value fragment into a parameterized string', function() {
        const query = new Query([
          'SELECT * FROM foobar WHERE "id" =',
          { value: 'id' },
          'AND "active" =',
          { value: 'active' }
        ]);
        const q = query.compile();
        const qs = q({ id: 4, active: true });
        assert.equal(qs.text, 'SELECT * FROM foobar WHERE "id" = $1 AND "active" = $2');
        assert.deepEqual(qs.values, [4, true]);
      });

      it('should throw an Error if value arg is missing', function() {
        const query = new Query([
          'SELECT * FROM foobar WHERE "id" =',
          { value: 'id' }
        ]);
        const q = query.compile();
        assert.throws(function() {
          const qs = q();
        }, /Missing/);
      });
    });

    describe('Fragment: custom', function() {
      it('should compile custom fragmnt into a parameterized string', function() {
        const query = new Query([
          'SELECT * FROM users WHERE "id" =',
          function(args, paramIndexStart) {
            return {
              text: '$1',
              values: [10]
            };
          },
          'ORDER BY id'
        ]);
        const q = query.compile();
        const qs = q();
        assert.equal(qs.text, 'SELECT * FROM users WHERE "id" = $1 ORDER BY id');
        assert.deepEqual(qs.values, [10]);
      });
    });

    describe('Complex queries', function() {
      it('query with value and equals fragments', function() {
        const query = new Query([
          'UPDATE', 'users',
          'SET', { equals: { join: ',', skip: ['id'] } },
          'WHERE "id" =', { value: 'id' }
        ]);
        const q = query.compile();
        const qs = q({ id: 4, email: 'foo@bar.com', active: true });
        assert.equal(qs.text, 'UPDATE users SET "email" = $1 , "active" = $2 WHERE "id" = $3');
        assert.deepEqual(qs.values, ['foo@bar.com', true, 4]);
      });
    });
  });
});
