const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
//const path = require('path');

const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.COOKIE_SECRET));

const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');

const authRoute = require('./routes/auth');
//configure body-parser for express
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = process.env.PORT || 9000;


app.use('/api/v1/auth', authRoute);
app.use('/api/v1/question', questionsRoute);

app.get('/', (req, res)=>{
    console.log(req.headers);
    res.status(200).send(req.headers);
});



app.get('/index.html', function(req, res) {
        res.sendFile(__dirname + "/" + "index.html");
    });









 
//Fetch all questions 





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

app.post('/upvote/:answerId', verifyToken, (req, res)=>{
    const userId =  req.body.user_id;
    const answerId = req.body.answer_id;
    const time =  new Date().toLocaleString();

        pool.query("INSERT INTO upvotes(user_id, answer_id, created_at) VALUES('"+userId+"', '"+answerId+"', '"+time+"'); ", [],function(err,result) {
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
        });
});




//downvoting of answers
app.post('/downvote/:answerId', verifyToken, (req, res)=>{
    const userId = 1;// req.body.user_id;
    const answerId = 1;//req.body.answer_id;
    const time =  new Date().toLocaleString();

    pool.query("INSERT INTO downvotes(user_id, answer_id, created_at) VALUES('"+userId+"', '"+answerId+"', '"+time+"'); ", [],function(err,result) {
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
    });

});



//verify token middleware
function  verifyToken(req, res, next) {
    //get request headers
    console.log(req.headers);
    const requestHeader = req.headers['authorization'];
    //check if header has the request token
    if(requestHeader !== undefined){
        //grant access to user
        const  bearer = requestHeader.split(' ');
        //get  the token
        req.token = bearer[1];
        console.log(req.token);
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

