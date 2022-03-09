const { Pool } = require('pg')

const pool = new Pool({
  host: '18.234.125.183',
  user: 'chaseriggs',
  database: 'chaseriggs',
  password: 'robertrules',
  port: 5432
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
});

pool.connect((err, pool, release) => {
  err
    ? console.log("error acquiring client", err.stack)
    : pool.query('SELECT NOW()')
    .catch(err => console.log(err.stack))
    .then(res => console.log(res.rows))
})

module.exports = pool;


// EXPLAIN ANALYZE logs Execution time of query

// May need to use callback to release the request for optimization
// if (err) {
//   return console.error('Error acquiring client', err.stack)
// }
// pool.query('SELECT NOW()', (err, result) => {
//   release()
//   if (err) {
//     return console.error('Error executing query', err.stack)
//   }
//   console.log(result.rows)
// })