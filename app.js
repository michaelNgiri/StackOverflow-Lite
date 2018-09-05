const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
//const path = require('path');

const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.COOKIE_SECRET));

const jwt = require('jsonwebtoken');

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
app.post('/auth/signup', function(req, res) {
    //call the function for validating user inputs
    if(userInfoIsValid(req.body)){
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
    const email = req.body.email;
    console.log(email);
    if (userInfoIsValid(req.body)) {
        pool.query("SELECT password FROM users WHERE email = '"+email+"' ", [], function (err, result) {
            console.log(result.rows.length);
            if (result.rows.length < 1) {
                console.log('this email is not registered');

            }else {
                (async () => {
                    const { rows } = await pool.query("SELECT password, id FROM users WHERE email = '"+email+"' ");
                    const dbPassword = rows[0].password;
                    const id = rows[0].id;
                    console.log('password in db is:');
                    // console.log();
                    console.log(dbPassword);
                    console.log('email exists, lets see if your password is correct');

                    //compare password sent by user with one in db
                    const match = await bcrypt.compare(req.body.password, dbPassword);
                    //const secureCookie = req.app.get('env') !== 'development';
                    if(match){
                        console.log('password is correct lets log you in');
                        //login the user
                        const user = {
                            email:email,
                            id:id
                        };

                        jwt.sign({user}, 'secret_key',{expiresIn:'30000s'}, (err, token)=>{
                            //set cookies
                            res.cookie( 'Authorization', token, {
                                httpOny:true,
                                //signed:true,
                                //secure:secureCookie
                            });
                            // res.headers({
                            //    Authorization:token
                            // });
                            res.json({
                                status:200,
                                message: "success, you are logged in",
                                Authorization:token,
                                id:id
                            })
                        });
                    }else {
                        //return authentication failure error
                        res.status(401).json({
                            status: 401,
                            msg: 'wrong password'
                        });
                    }
                })()
            }
        });
    }else {
        //return authentication failure error
        res.status(401).json({
            status: 401,
            msg: 'invalid login details, try again'
        });
    }
});
 
//Fetch all questions 
app.get('/questions', verifyToken, function (req, res) {
       res.send("StackOverflow Lite");
});

app.get('/', (req, res)=>{
    res.sendStatus(200);
});

//Fetch a specific  question 
//This should come with all the  answers  provided so far for the question. 
app.get('/questions/<questionId>', function (req, res) {
	res.send("StackOverflow Lite");
});

//Post a question 
app.post('/questions', verifyToken, function (req, res) {
    
});

//Delete a question
//This endpoint should be available to  the author of the question. 
app.delete('/questions/<questionId>', function (req, res) {
	res.send("StackOverflow Lite");
});

//Post an answer to  a question
app.post('/questions/<questionId>/answers', function (req, res) {

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
        // console.log(user.email);
        // console.log(user.password.trim());
        return true;
    }
    console.log(user);
    return false;
}

//verify token middleware
function  verifyToken(req, res, next) {
    //get request headers
    const requestHeader = req.headers['authorization'];
    console.log('this is the token below:');
    console.log(requestHeader);
    //check if header has the request token
    if(requestHeader !== undefined){
        //grant access to user
        const  bearer = requestHeader.split(' ');
        //get  the token
        const requestToken = bearer[1];
        req.token = requestToken;

        jwt.verify(req.token, 'secret_key', (err, user)=>{
            if(err){
                console.log(err);
                res.status(403).json({
                    status:403,
                    msg:"forbidden, you do not have authorization to access this url"
                });
            }else {
                next();
            }
        });

    }else {
        //restrict access if token is absent
        res.status(403).send('you are not allowed to access this url');
    }
}

//