// var mysql = require('mysql'); // not working anymore
// just call "node databasetest.js" from anywhere once the docker stuff is done
const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'sample_user',
  password: 'password',
  database: 'todo',
  port: 3306
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Database connected!");
  con.promise().query("select * from todo_list;")
    .then(([rows, fields]) => {
      console.log("Database Promise Result:");
      console.table(rows);
    })
    .catch(console.log)
    .then(() => {
      console.log("Close Database connection.");
      con.end()
    });
});