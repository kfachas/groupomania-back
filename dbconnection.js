const mysql = require("mysql2");
const port = process.env.PORT || 3310;
let con;

if (port === 3310) {
  con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "groupomania",
  });
} else {
  //same as above, with live server details
}

// const createUserTable = `CREATE TABLE users (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password BINARY(60) NOT NULL, image_url VARCHAR(255), is_admin BOOLEAN NOT NULL);`;

// const createPostTable = `CREATE TABLE posts (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, title VARCHAR(100) NOT NULL, description VARCHAR(255), image_url VARCHAR(255), owner_id INT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, last_comment_id INTEGER);`;

// const createLikeTable = `CREATE TABLE likes (post_id INTEGER NOT NULL, owner_id INTEGER NOT NULL, id INTEGER NOT NULL);`;

// const createCommentTable = `CREATE TABLE comments (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, text VARCHAR(255) NOT NULL, owner_id INT NOT NULL, post_id INT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);`;

// con.query("SELECT * FROM users;", (err, res) => console.log({ err, res }));
// con.query(
//   "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));",
//   (err, res) => console.log({ err, res })
// );

// jeandupont@gmail.com   Motdepasse! isNotAdmin
// axelponton@gmail.com   motdepasse! isAdmin

con.connect((err) => {
  if (err) throw err;
  console.log("Connecté!");
});

module.exports = con;
