const Pool = require('pg').Pool;
const config = {
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'stack-lite',
};
const pool = new Pool(config);






// const { Pool } = require('pg')
//
// const pool = new Pool()
//
// module.exports = {
//     query: (text, params, callback) => {
//         const start = Date.now()
//         return pool.query(text, params, (err, res) => {
//             const duration = Date.now() - start
//             console.log('executed query', { text, duration, rows: res.rowCount })
//             callback(err, res)
//         })
//     }
// }