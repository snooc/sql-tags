"use strict";

const assert = require("assert");
const sql = require("..");

describe("pgSql()", function() {
  it ("should return empty string with no values when input is an empty string", function() {
    const query = sql.pgSql``;

    assert.equal(query.text, "");
    assert.equal(query.values.length, 0);
  });

  it ("should return parameterized query when input is a string with basic values of type string and number", function() {
    const query = sql.pgSql`SELECT * FROM table WHEN id = ${1} and email = ${"foo@bar.com"}`;

    assert.equal(query.text, "SELECT * FROM table WHEN id = $1 and email = $2");
    assert.deepEqual(query.values, [1, "foo@bar.com"]);
  });

  it ("should return parameterized query when input is a string with table object as value", function() {
    const query = sql.pgSql`SELECT * FROM ${{ table: "users" }}`;

    assert.equal(query.text, "SELECT * FROM users");
    assert.equal(query.values.length, 0);
  });

  it ("should return parameterized query when input is a string with table object and basic values", function() {
    const query = sql.pgSql`SELECT * FROM ${{ table: "users" }} WHEN id = ${1} and email = ${"foo@bar.com"}`;

    assert.equal(query.text, "SELECT * FROM users WHEN id = $1 and email = $2");
    assert.deepEqual(query.values, [1, "foo@bar.com"]);
  });

  it ("should return parameterized query when input is a string with columns object as value", function() {
    const query = sql.pgSql`SELECT ${{ columns: ["id", "email", "password" ]}} FROM users`;

    assert.equal(query.text, "SELECT \"id\", \"email\", \"password\" FROM users");
    assert.equal(query.values.length, 0);
  });

  it ("should return parameterized query when input is a string with columns object and table oject as values", function() {
    const query = sql.pgSql`SELECT ${{ columns: ["id", "email", "password" ]}} FROM ${{ table: "users" }}`;

    assert.equal(query.text, "SELECT \"id\", \"email\", \"password\" FROM users");
    assert.equal(query.values.length, 0);
  });

  it ("should return parameterized query when input is a string with columns object, table object and basic values", function() {
    const query = sql.pgSql`SELECT ${{ columns: ["id", "email", "password" ]}} FROM ${{ table: "users" }} WHERE id = ${1} and email = ${"foo@bar.com"}`;

    assert.equal(query.text, "SELECT \"id\", \"email\", \"password\" FROM users WHERE id = $1 and email = $2");
    assert.deepEqual(query.values, [1, "foo@bar.com"]);
  });

  it ("should ignore newlines", function() {
    const query = sql.pgSql`
      SELECT *
      FROM table
    `;

    assert.equal(query.text, "SELECT * FROM table");
    assert.equal(query.values.length, 0);
  });
});
