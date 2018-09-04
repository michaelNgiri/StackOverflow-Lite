//db queries

// pool.query("INSERT INTO users(first_name, last_name, email) values('mike','mikeom','mike@mike.com')");
// pool.query("INSERT INTO users(first_name, last_name, email) values('mike2','mikeom','mike@mike.com')");

// let fname = 'first_name';
// let lname = 'last_name';
// let email = 'mailer@me.com';
//
// pool.query("INSERT INTO users(first_name, last_name, email) VALUES('"+fname+"', '"+lname+"', '"+email+"');");
}

// async function insert_a_user(){
// 	//var response = await pool.query("select * from users");
// 	pool.query("INSERT INTO users(id SERIAL PRIMARY KEY, name TEXT, link TEXT, email TEXT);");
// 	pool.query("CREATE TABLE IF NOT EXISTS questions(id SERIAL PRIMARY KEY, created_at TIMESTAMP,  updated_at TIMESTAMP, link TEXT, senderId TEXT, sendermsg TEXT, senderName TEXT, receiverId TEXT);");
// 	pool.query("CREATE TABLE IF NOT EXISTS answers(id SERIAL PRIMARY KEY, created_at TIMESTAMP, updated_at TIMESTAMP, link TEXT, senderId TEXT, sendermsg TEXT, senderName TEXT, receiverId TEXT)");
// 	console.log("successful");
// }



//var response = await pool.query("select * from users");


user validation

// function validUserInfo(user){
//     const validEmail = typeof user.email === "string" && user.email.trim() !== '';
//     const validPassword = typeof user.password === "string" && user.password.trim() !== '' && user.password.trim() > 5;
//
//     console.log(validEmail + user.email);
//     console.log(validPassword);
//     console.log(user.password);
//     return validEmail && validPassword;
// }

async function userExists(user) {
    const email = user.email;
    pool.query("SELECT * FROM users WHERE email = '" + email + "' ", [], function (err, result) {
        if (err) {
            // pass the error to the express error handler
            return next(err)
        }
// console.log(noOfUsers);
// if (noOfUsers !== 0){
//     return true;
// }else {
//     return false;
// }


// const query = pool.query("SELECT * FROM users WHERE email = '" + email + "' ", (err, res) => {
//     console.log(err ? err.stack : res.rows[0]); // Hello World!
// });
// console.log(query);
// return query != null;






login queries
        (async () => {

            const { rows } = await pool.query("SELECT password FROM users WHERE email = '"+email+"' ")

            if ({ rows }.length < 1) {

                console.log('this email is not registered');

            }else {
                const dbPassword = rows[0].password;

                console.log(dbPassword);

                console.log(result);
                console.log('email exists, lets see if your password is correct');
                // bcrypt.compare(req.body.password, result.password).then(function (result) {
                //     console.log(result);
                // });
            }
        })()