var Pool = require('pg').Pool;
var config = {
	host: 'localhost',
	user: 'postgres',
	password: 'password',
	database: 'stack-lite',
};

var pool = new Pool(config);
async function setup_database(){
	//var response = await pool.query("select * from users");
	pool.query("CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name TEXT, link TEXT, email TEXT);");
	console.log("successful");
}

// async function insert_a_user(){
// 	//var response = await pool.query("select * from users");
// 	pool.query("INSERT INTO users(id SERIAL PRIMARY KEY, name TEXT, link TEXT, email TEXT);");
// 	pool.query("CREATE TABLE IF NOT EXISTS questions(id SERIAL PRIMARY KEY, created_at TIMESTAMP,  updated_at TIMESTAMP, link TEXT, senderId TEXT, sendermsg TEXT, senderName TEXT, receiverId TEXT);");
// 	pool.query("CREATE TABLE IF NOT EXISTS answers(id SERIAL PRIMARY KEY, created_at TIMESTAMP, updated_at TIMESTAMP, link TEXT, senderId TEXT, sendermsg TEXT, senderName TEXT, receiverId TEXT)");
// 	console.log("successful");
// }

setup_database();