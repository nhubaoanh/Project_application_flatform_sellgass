import mysql from 'mysql2'
const db =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  //  password: '12345',
   password: 'bao123@',
  database: 'shopbankinh',
  multipleStatements: true, 
})
export default db;
