
require('dotenv').config();


if (process.env.APP_ENV === 'local') {
    module.exports = {
        host: 'localhost',
        user: 'postgres',
        password: 'password',
        database: 'stack-lite',
    };
}else{
    module.exports = {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };
}

