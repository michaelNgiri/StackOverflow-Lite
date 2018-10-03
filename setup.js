require('dotenv').config()
const Pool = require('pg').Pool;
const config = {
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
};

const pool = new Pool(config);

//Function for creating tables in the database
async function setup_database() {
    pool.query("CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY NOT NULL, first_name VARCHAR(30), last_name VARCHAR(30), email VARCHAR(50) UNIQUE NOT NULL, username VARCHAR(30), password VARCHAR(256), role INTEGER, created_at TIMESTAMP, deleted_at TIMESTAMP);");
    pool.query("CREATE TABLE IF NOT EXISTS questions(id SERIAL PRIMARY KEY, created_at TIMESTAMP, user_id INTEGER, closed_at TIMESTAMP,  deleted_at TIMESTAMP, repo_link VARCHAR, question_title VARCHAR, question_body VARCHAR, keywords VARCHAR);");
    pool.query("CREATE TABLE IF NOT EXISTS answers(id SERIAL PRIMARY KEY, user_id INTEGER, created_at TIMESTAMP, deleted_at TIMESTAMP, selected_at TIMESTAMP, repo_link VARCHAR, linked_question_id INTEGER, answer_text VARCHAR);");
    pool.query("CREATE TABLE IF NOT EXISTS upvotes(id SERIAL PRIMARY KEY, answer_id INTEGER, created_at TIMESTAMP, deleted_at TIMESTAMP, user_id INTEGER, comment VARCHAR);");
    pool.query("CREATE TABLE IF NOT EXISTS downvotes(id SERIAL PRIMARY KEY, answer_id INTEGER, created_at TIMESTAMP, deleted_at TIMESTAMP, user_id INTEGER, comment VARCHAR);");
    pool.query("CREATE TABLE IF NOT EXISTS comments(id SERIAL PRIMARY KEY, answer_id INTEGER, created_at TIMESTAMP, deleted_at TIMESTAMP, user_id INTEGER, comment VARCHAR);");
    }


//This function wil help in inserting data to the database
setup_database()
    .then(console.log('successfully created databases'))
    .catch('failed to create database');


    console.log('http://localhost:'+port+'/api/v1/auth/signup');