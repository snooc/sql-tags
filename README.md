# SQL Templates Tag

[![Build Status](https://travis-ci.org/snooc/sql-tags.svg?branch=master)](https://travis-ci.org/snooc/sql-tags)

ES6 tag functions for SQL template strings.

WARNING: This project is still under development and the API is subject to change.

## Introduction

sql-tags uses ES6 template strings to generate a function that can then be used to create a query string based on rules, *fragments*, specified in the template string. The primary objective sql-tags is to create a lightweight API to make it easy to work with SQL queries and JavaScript objects.

The generated function's arguments are used by the fragments to generate a query.

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

## Fragments

### Value Fragment

The Value Fragment generates a parameterized query string in the form of `value`.

```javascript
{
  value: <value key>
}
```

### Equals Fragment

The Equals Fragment generates a parameterized query string in the form of `"key" = value` and joins each string with the `join` param. It also has options available to skip keys and for empty args.

```javascript
{
  equals: {
    join: <join string>,
    skip: [<skip args>],
    whenEmpty: <empty string>
  }
}
```

### Custom Fragment

Custom Fragments are just a query with the signature of:

```javascript
function (args, paramIndexStart) {
  return {
    text: <query fragment>,
    values: [<query params>]
  };
}
```

Custom Fragments must return an object that contains the query fragment text and values. Values must be in parameterized query form of `$<num>` start with the paramIndexStart.

##### Example

```javascript
function simpleTrueFragment(args, paramIndexStart) {
  return {
    text: '$' + paramIndexStart,
    values: [true]
  };
}

const query = sql`
  SELECT ${simpleTrueFragment}
`;

query();
// => {
// =>   text: 'SELECT $1',
// =>   values: [true]
// => }
```

## License

MIT
