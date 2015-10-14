'use strict';

const assert = require('assert');
const sql = require('..');

describe('sql', function() {
  describe('#sql()', function() {
    it('should return a query function when used as a template tag function', function() {
      const usersQuery = sql`
        SELECT ${{ columns: ["id", "email", "password", "created", "modified"]}}
        FROM ${{ table: "users" }}
        WHERE id = ${{ value: "id" }}
      `;

      assert.equal(typeof usersQuery, 'function');
    });

    it('should return proper compiledQuery', function() {
      const usersQuery = sql`
        SELECT ${{ columns: ["id", "email", "password", "created", "modified"]}}
        FROM ${{ table: "users" }}
        WHERE id = ${{ value: "id" }}
      `;

      assert.deepEqual(usersQuery._compiledQuery.strings, ['SELECT "id", "email", "password", "created", "modified" FROM users WHERE id = ', '']);
      assert.deepEqual(usersQuery._compiledQuery.values, ['id']);
    });

    it('should throw an Error if executed with incorrect number of arguments', function() {
      const usersQuery = sql`
        SELECT ${{ columns: ["id", "email", "password", "created", "modified"]}}
        FROM ${{ table: "users" }}
        WHERE id = ${{ value: "id" }}
      `;

      assert.throws(function() {
        usersQuery();
      }, /Missing/i);
    });

    it('should return a query object when executred with correct arguments', function() {
      const usersQuery = sql`
        SELECT ${{ columns: ["id", "email", "password", "created", "modified"]}}
        FROM ${{ table: "users" }}
        WHERE email = ${{ value: "email" }} AND password = ${{ value: "password" }}
      `;

      const query = usersQuery('foo@bar.com', 'secret');
      assert.equal(query.text, 'SELECT "id", "email", "password", "created", "modified" FROM users WHERE email = $1 AND password = $2');
      assert.deepEqual(query.values, ['foo@bar.com', 'secret']);
    });
  });
});
