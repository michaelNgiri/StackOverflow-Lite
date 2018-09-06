var Pool = require('pg').Pool;
var config = {
	host: 'localhost',
	user: 'postgres',
	password: 'password',
	database: 'stack-lite',
};

var pool = new Pool(config);
async function setup_database() {
    pool.query("CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY NOT NULL, first_name VARCHAR(30), last_name VARCHAR(30), email VARCHAR(50) UNIQUE NOT NULL, username VARCHAR(30), password VARCHAR(256), role INTEGER, created_at TIMESTAMP, deleted_at TIMESTAMP);");
    pool.query("CREATE TABLE IF NOT EXISTS questions(id SERIAL PRIMARY KEY, created_at TIMESTAMP, user_id INTEGER, closed_at TIMESTAMP,  deleted_at TIMESTAMP, repo_link TEXT, question_title TEXT, question_body TEXT, keywords VARCHAR);");
    pool.query("CREATE TABLE IF NOT EXISTS answers(id SERIAL PRIMARY KEY, user_id INTEGER, created_at TIMESTAMP, deleted_at TIMESTAMP, selected_at TIMESTAMP, repo_link VARCHAR, linked_question_id INTEGER, answer_text VARCHAR);");
    pool.query("CREATE TABLE IF NOT EXISTS upvotes(id SERIAL PRIMARY KEY, answer_id INTEGER, created_at TIMESTAMP, deleted_at TIMESTAMP, user_id INTEGER, comment VARCHAR);");
    pool.query("CREATE TABLE IF NOT EXISTS downvotes(id SERIAL PRIMARY KEY, answer_id INTEGER, created_at TIMESTAMP, deleted_at TIMESTAMP, user_id INTEGER, comment VARCHAR);");
    pool.query("CREATE TABLE IF NOT EXISTS comments(id SERIAL PRIMARY KEY, answer_id INTEGER, created_at TIMESTAMP, deleted_at TIMESTAMP, user_id INTEGER, comment VARCHAR);");
    }

setup_database()
    .then(console.log('successfully created databases'))
    .catch('failed to create database');