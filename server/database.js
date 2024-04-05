const mysql = require('mysql2');
require('dotenv').config();

// Create a connection using environment variables from your .env file
const connection =  mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // const createTableSQL = `
// CREATE TABLE messages (
//   campaignID INT,
//   agentID INT,
//   sendDateTime DATETIME,
//   status VARCHAR(255),
//   PRIMARY KEY (campaignID, agentID)
// );`;
// const createAgentsTableSQL = `
// CREATE TABLE agents (
//   Name VARCHAR(255),
//   Company VARCHAR(255),
//   AgentLicense VARCHAR(255),
//   Phone VARCHAR(20),
//   Reviews INT,
//   Picture TEXT,
//   Link TEXT,
//   City VARCHAR(255),
//   State VARCHAR(255)
// );`;

// const createTableSQL = `
// CREATE TABLE campaigns (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   title VARCHAR(255),
//   description TEXT,
//   startDate DATE,
//   endDate DATE,
//   message TEXT,
//   city VARCHAR(255),
//   state VARCHAR(255),
//   count VARCHAR(255)
// );`


connection.connect(err => {
  if (err) {
    console.error('An error occurred while connecting to the DB:', err);
    return;
  }
  console.log('Successfully connected to the database.');
}
);

  // connection.query(createTableSQL, (err, results) => {
  //       if (err) {
  //       console.error('An error occurred while creating the table:', err);
  //       return;
  //       }
  //       console.log('Table created successfully:', results);
  //   });
 

const promisePool = pool.promise();

module.exports = {
  query: async (sql, params) => {
    return promisePool.query(sql, params);
  }
};