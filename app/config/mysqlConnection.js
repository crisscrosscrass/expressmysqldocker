const mysql = require('mysql2');
const logger = require("./logger");

class MySQLConnection {
  constructor() {
    this.con = null;
    try {
      this.con = mysql.createConnection({
        host: 'database',
        user: 'sample_user',
        password: 'password',
        database: 'todo',
        port: 3306
      });
    } catch (error) {
      logger.error(error);
    }
  }
  createSample(res) {
    if (this.con) {
      this.con.connect((err) => {
        if (err) throw err;
        logger.info("Connected to Database!");
        this.con.promise().query("insert into todo_list (name) VALUES ('RandomTaskABC')")
          .then(([rows, fields]) => {
            logger.info("PROMISE RESULT: ==============================>");
            console.table(rows);
          })
          .catch((error) => console.log(error))
          .then(() => {
            logger.info("Close connection to Database");
            // this.con.end()
            res.send('Item has been saved successfully!');
          })
          .catch((error) => console.log(error));
      });
    }
  }
}

module.exports = new MySQLConnection();