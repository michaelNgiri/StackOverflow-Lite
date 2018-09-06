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



app.get('/', (req, res)=>{
    console.log(req.headers);
    res.send(req.headers);
});



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
                            const authToken = "bearer"+" "+token;
                            res.cookie( 'Authorization',authToken, {
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
                                Authorization:authToken,
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
app.get('/questions', function (req, res) {
    (async () => {
        const { rows } = await pool.query("SELECT * FROM questions");
        const result = rows;
        res.json(result);
    })()
});







//Fetch a specific  question 
//This should come with all the  answers  provided so far for the question. 
app.get('/questions/:questionId', (req, res)=>{
    //const questionId = req.body.questionId
    let questionAnswers = [];
   let questionId=req.body.question_id;
    (async () => {
        //check if the question with that id exists in database
        const { rows } = await pool.query("SELECT * FROM questions where id = '"+questionId+"' ");
        const question = rows[0];
        console.log(question);
        //console.log(question.length)
        if (rows.length < 1 || rows.length === undefined) {

            res.status(404).json({
                status:404,
                msg:'the question does not exist'
            });
            console.log('the question does not exist');
        }else {
            //retrieve answers if question exists
            console.log('the question exists, lets see if it has answers');
            (async () => {
                const { rows } = await pool.query("SELECT * FROM answers where linked_question_id = '"+questionId+"' ");

                if (rows.length < 1 || rows.length === undefined) {
                    console.log('no answer yet');
                 questionAnswers = 'no answer yet';
                }else {
                questionAnswers = rows[0];
                }
                res.status(200).json({
                    status:200,
                    question:question,
                    answers:questionAnswers
                })
            })()
        }

    })();
});






//Post a question 
app.post('/questions', verifyToken, (req, res)=>{
    const qTitle = req.body.question_title;
    const question = req.body.question;
    const id = req.body.id;

    pool.query("INSERT INTO questions(user_id, question_title, question_body) VALUES('"+id+"', '"+qTitle+"', '"+question+"');", [],function(err,result) {
        if(err){
            console.log(err);
            console.log('could not save question');
            res.status(400).json({
                status:400,
                msg:"could not save your question, try later"
            });
        }
        res.status(200).json({
            status: 200,
            //result:result.rows
        });
    });

});





//Delete a question
//This endpoint should be available to  the author of the question. 
app.delete('/questions/:questionId', function (req, res) {
const questionId = req.body.question_id;
    pool.query("DELETE FROM questions where id = '"+questionId+"' ", [],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                status:400,
                msg:'cant delete, the question does not exist'
            });
        }
        res.status(200).send('question deleted');
    });
});





//Post an answer to  a question
app.post('/questions/:questionId/answers', verifyToken, (req, res)=>{
    const questionId = req.body.question_id;
    const answer = req.body.answer;
    const userId = req.body.user_id;
    (async () => {
        //check if the question with that id exists in database before saving an answer to it
        const { rows } = await pool.query("SELECT * FROM questions where id = '"+questionId+"' ");
        const question = rows[0];
        console.log(question);
        //console.log(question.length)
        if (rows.length < 1 || rows.length === undefined) {

            res.status(404).json({
                status:404,
                msg:'the question does not exist'
            });
            console.log('the question does not exist');
        }else {
            //save the answer if question exists
            console.log('the question exists, lets save your answer');
            pool.query("INSERT INTO answers(user_id, linked_question_id, answer_text) VALUES('"+userId+"', '"+questionId+"', '"+answer+"');", [],(err,result)=>{
                if(err){
                    console.log(err);
                    res.status(400).json({
                        status:400,
                        msg:'unable to save your answer, try again later'
                    });
                }
                res.status(200).send('answer saved');
            });
        }

    })();
});



//Mark an answer as  accepted or  update an answer.
//This endpoint should be available to  only the answer author and question 
// author. The answer author calls the  route to
// update answer while the  question author calls the route to  accept answer.
app.put('/questions/:questionId/answers/:answerId', verifyToken, (req, res)=>{
    const questionId = req.body.question_id;
    const answerId = req.body.answer_id;
    const userId = req.body.user_id;
    const time =  new Date().toLocaleString();
    console.log('lets check for the requested question');
    pool.query("SELECT user_id FROM questions where id = '"+questionId+"' ", [],function(err,result) {
        if(err){
            console.log(err);
            console.log('could not find the question');
            res.status(400).json({
                status:400,
                msg:"could not find the question, try later"
            });
        }else {
            console.log(result);
            //mark answer as accepted
            if(result['rows'][0]['user_id'] === userId){
                pool.query("UPDATE answers SET selected_at = '"+time+"' where id = '"+answerId+"' ", [],function(err,result) {
                    if(err) {
                        console.log(err);
                        console.log('action failed');
                        res.status(400).json({
                            status: 400,
                            msg: "could not complete the requested action, try later"
                        });
                    }else {
                        console.log('action completed');
                        res.status(200).json({
                            status: 200,
                            msg: "succesful!"
                        });
                    }
                }); //end function to mark answer as selected

                console.log(result['rows'][0]['user_id']);

            }else {
                res.status(401).send('access denied');
            }

        }
    });
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
    //check if header has the request token
    if(requestHeader !== undefined){
        //grant access to user
        const  bearer = requestHeader.split(' ');
        //get  the token
        const requestToken = bearer[1];
        req.token = requestToken;

        jwt.verify(req.token, 'secret_key', (err, user)=>{
            if(err){
                console.log('token verification failed');
                //console.log(err);
                res.status(403).json({
                    status:403,
                    msg:"forbidden, you do not have authorization to access this url"
                });
            }else {
                console.log('token verified, access granted');
                next();
            }
        });

    }else {
        console.log('request token missing');
        //restrict access if token is absent
        res.status(403).send('you are not allowed to access this url');
    }
}

//
//app.use(express.static(public));

app.listen(port, function(err){
    console.log('server started at port: ' + port);
});