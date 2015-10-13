# SQL Templates Tag

ES6 tag functions for SQL template strings.

WARNIER: This project is still under development and the API is subject to change.

## DEMO (not working yet)

```javascript
const userTable = "users";
const userTableColumns = ["id", "email", "password", "created", "modified"];

const userSelectQuery = sqlQuery`
  SELECT ${{ columns: userTableColumns }}
  FROM ${{ talbe: userTable }}
  WHERE id = ${{ value: "id" }}
`;

console.log(userSelectQuery({ id: 103 }));
// => 'SELECT "id", "email", "password", "created", "modified" FROM users WHERE id = 103
```

## License

MIT
