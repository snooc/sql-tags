# SQL Templates Tag

[![Build Status](https://travis-ci.org/snooc/sql-tags.svg?branch=master)](https://travis-ci.org/snooc/sql-tags)

ES6 tag functions for SQL template strings.

WARNING: This project is still under development and the API is subject to change. A major overhaul to the API was introduced in v0.1.0.

## DEMO

```javascript
const sql = require('sql-tags');

const usersTable = 'users';
const usersTableColumns = ['id', 'email', 'password', 'active', 'created', 'modified'];

const findUsersQuery = sql`
  SELECT ${usersTableColumns}
  FROM ${usersTable}
  WHERE ${{ equals: { join: 'AND', whenEmpty: 'TRUE' } }}
`;

userSelectQuery({ email: 'foobar@example.com', active: true });
// => {
// =>   text: 'SELECT "id", "email", "password", "active", "created", "modified" FROM users WHERE "email" = $1 AND "active" = $2',
// =>   values: ['foo@bar.com', true]
// => }

userSelectQuery({});
// => {
// =>   text: 'SELECT "id", "email", "password", "active", "created", "modified" FROM users WHERE TRUE',
// =>   values: []
// => }

userSelectQuery();
// => {
// =>   text: 'SELECT "id", "email", "password", "active", "created", "modified" FROM users WHERE TRUE',
// =>   values: []
// => }

const updateUsersQuery = sql`
  UPDATE ${usersTable}
  SET ${{ equals: { join: ',', skip: ['id'] } }}
  WHERE "id" = ${{ value: 'id' }}
`;

updateUsersQuery({ id: 4, email: 'foobar@example.com', modified: new Date() });
// => {
// =>   text: 'UPDATE users SET "email" = $1 , "modified" = $2 WHERE "id" = $3',
// =>   values: ['foobar@example.com', "Mon Dec 07 2015 09:36:00 GMT-0500 (EST)", 4]
// => }
```

## License

MIT
