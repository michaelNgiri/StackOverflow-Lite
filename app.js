const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const path = require('path');

const bodyParser = require('body-parser');



//configure body-parser for express
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const Pool = require('pg').Pool;
const config = {
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'stack-lite',
};
const pool = new Pool(config);


app.get('/index.html', function(req, res) {
        res.sendFile(__dirname + "/" + "index.html");
    });


//Register a user 
app.post('/auth/signup', function (req, res) {
    //call the function for validating user inputs
    if (userInfoIsValid(req.body)){
        console.log('valid info submitted');
        let userInfo = req.body;
        const firstName = userInfo.first_name;
        const lastName = userInfo.last_name;
        const email = userInfo.email;
        const password = userInfo.password;
        //check if the email supplied exists in database
        pool.query("SELECT * FROM users WHERE email = '" + email + "' ", [], function (err, result) {
            console.log(result.rows.length);
            if(result.rows.length<1){
            bcrypt.hash(password, 8).then(function (hashedPassword) {
                //insert the user to database if not already registered
                pool.query("INSERT INTO users(first_name, last_name, email, password) VALUES('"+firstName+"', '"+lastName+"', '"+email+"', '"+hashedPassword+"');", function(err, queryResult) {
                    console.log(queryResult);
                    res.send('registration successful')
                });
                });

            }else {
         //give a feedback to the user if email is already in use
        res.send('email in use');
            }
        });
    }else {
        //feedback to the user if the information supplied is invalid
        console.log('invalid info submitted');
        res.send('invalid info submitted');
    }
});

//Login a user 
app.post('/auth/login', function (req, res) {
    res.send("hi there");
});
 
//Fetch all questions 
app.get('/questions', function (req, res) {
	res.send("StackOverflow Lite");
});

//Fetch a specific  question 
//This should come with all the  answers  provided so far for the question. 
app.get('/questions/<questionId>', function (req, res) {
	res.send("StackOverflow Lite");
});

//Post a question 
app.post('/questions', function (req, res) {
    res.send("hi there");
});

//Delete a question
//This endpoint should be available to  the author of the question. 
app.delete('/questions/<questionId>', function (req, res) {
	res.send("StackOverflow Lite");
});

//Post an answer to  a question
app.post('/questions/<questionId>/answers', function (req, res) {
    res.send("hi there");
});

//Mark an answer as  accepted or  update an answer.
//This endpoint should be available to  only the answer author and question 
// author. The answer author calls the  route to
// update answer while the  question author calls the route to  accept answer.
app.put('/questions/<questionId>/answers/<answerId>', function (req, res) {
    res.send("hi there");
});



//app.use(express.static(public));

app.listen(port, function(err){
	console.log('server started at port: ' + port);
});




function userInfoIsValid(user){
    if (typeof user.email === "string" &&
        user.email.trim() !== '' &&
        typeof user.password === "string" &&
        user.password.trim() !== '' &&
        user.password.trim().length >= 5) {
        console.log(user.email);
        console.log(user.password.trim());
        return true;
    }
    return false;
}
