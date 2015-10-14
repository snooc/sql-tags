# SQL Templates Tag

ES6 tag functions for SQL template strings.

WARNING: This project is still under development and the API is subject to change.

## DEMO

```javascript
const sql = require('sql-tags');

const userTable = 'users';
const userTableColumns = ['id', 'email', 'password', 'created', 'modified'];

const usersSelectQuery = sql`
  SELECT ${{ columns: ['id', 'email', 'password', 'created', 'modified']}}
  FROM ${{ table: 'users' }}
  WHERE email = ${{ value: 'email' }} AND password = ${{ value: 'password' }}
`;

console.log(userSelectQuery('foo@bar.com', 'secret'));
// => {
// =>   text: 'SELECT "id", "email", "password", "created", "modified" FROM users WHERE email = $1 AND password = $2',
// =>   values: ['foo@bar.com', 'secret']
// = }
```

## License

MIT
