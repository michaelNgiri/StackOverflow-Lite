const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();
const config = require('../db/db-string');
const verifyToken = require('../middlewares/verifyToken');

const cors = require('cors');
router.use(cors());

//enable cors
router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers","*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

const send400= require('../helpers/400response');
const send200= require('../helpers/200response');
const send404= require('../helpers/404response');

const Pool = require('pg').Pool;


const pool = new Pool(config);

/*
 * @oas [get] /api/v1/questions/
 * description: "fetch all questions"
 * parameters:
 *   - (path) questions 
 *   - (query result) several
*/
//Fetch all questions 
router.get('/', (req, res)=>{
    (async () => {
        const { rows } = await pool.query("SELECT * FROM questions");
        res.status(200).json(rows);
    })()
});

/*
 * @oas [get] /api/v1/questions/recent
 * description: "fetch the most recent question"
 * parameters:
 *   - (path) recent question
 *   - (query recult) 1
*/
//get the most recent question
router.get('/recent', (req, res)=>{
    (async () => { 
    	console.log('fetching the latest question');
        const { rows } = await pool.query("select * from questions where id != 0 order by created_at desc limit 1");
        console.log(rows);
        res.status(200).json(rows);
    })()
});

router.get('question/owner/:ownerId', (req, res)=>{
    const userId = req.params.userId;
    (async () => {
        console.log('fetching the latest question');
        const { rows } = await pool.query("select first_name, last_name, email from users where id = '"+userId+"' ");
        console.log('the question was asked by'+rows);
        console.log(rows);
        res.status(200).json(rows);
    })()
});




/*
 * @oas [get] /api/v1/questions/questionId
 * description: "fetch a specific question"
 * parameters:
 *   - (path) question
 *   - (query result) 1
     - (question id) id of the question you want to access
*/
//Fetch a specific  question 
//This should come with all the  answers  provided so far for the question. 
router.get('/:questionId', (req, res)=>{
    //const questionId = req.body.questionId
    let questionAnswers = [];
   const questionId=req.body.question_id;
    (async () => {
        //check if the question with that id exists in database
        const { rows } = await pool.query("SELECT * FROM questions where id = '"+questionId+"' ");
        const question = rows[0];
        console.log(question);
        //console.log(question.length)
        if (rows.length < 1 || rows.length === undefined) {

            send404(res);
            console.log('the question does not exist');
        }else {
            //retrieve answers if question exists
            console.log('the question exists, lets see if it has answers');
            (async () => {
                const { rows } = await pool.query("SELECT * FROM answers where linked_question_id = '"+questionId+"' ");

                if (rows.length < 1 || rows.length === undefined) {
                    console.log('no answer yet');
                 questionAnswers = 'no answer yet';
                }else {  questionAnswers = rows[0]; }
                res.status(200).json({
                    status:200, question:question, answers:questionAnswers
                })
            })()
        }

    })();
});

/*
 * @oas [post] /api/v1/questions/
 * description: "mark an answer as accepted"
 * parameters:
 *   - (path) post a question
 *   - (query result) 0
     - (question)the question you want to ask
     - (question title) title of the question 
     - (user id) id of the user attempting this action
*/
//Post a question 
router.post('/', verifyToken, (req, res)=>{
	console.log('request received, lets try and save your question');
    const qTitle = req.body.question_title;
    const question = req.body.question;
    const userId = req.body.id;
    const timestamp =  new Date().toLocaleString();
    console.log(req.body);

    pool.query("INSERT INTO questions(user_id, question_title, question_body, created_at) VALUES('"+userId+"', '"+qTitle+"', '"+question+"', '"+timestamp+"');",(err,result)=>{
        if(err){
            console.log(err);
            console.log('could not save question');
            send400(res);
        }else{
        	send200(res);
        }
        
    });

});


/*
 * @oas [delete] /api/v1/questions/delete
 * description: "delete a question"
 * parameters:
 *   - (path) delete a question
 *   - (query result) 0
     - (question id) id of the question you want to delete
*/

//Delete a question
//This endpoint should be available to  the author of the question. 
router.delete('/:questionId', verifyToken, (req, res)=>{
const questionId = req.body.question_id;
    pool.query("DELETE FROM questions where id = '"+questionId+"' ", [],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                status:400,
                message:'cant delete, the question does not exist'
            });
        }
        send200(res);
    });
});


/*
 * @oas [post] /api/v1/questions/answers
 * description: "post an answer to a question"
 * parameters:
 *   - (path) questions answer
 *   - (query result) 0
     - (question id) id of the question that you wish to answer
     - (user id) id of the user attempting this action
*/

//Post an answer to  a question
router.post('/answers', verifyToken, (req, res)=>{
    const questionId = req.body.question_id;
    const answer = req.body.answer;
    const userId = req.body.user_id;
    const timestamp =  new Date().toLocaleString();
    (async () => {
        //check if the question with that id exists in database before saving an answer to it
        const { rows } = await pool.query("SELECT * FROM questions where id = '"+questionId+"' ");
        const question = rows[0];
        console.log(question);
        //console.log(question.length)
        if (rows.length < 1 || rows.length === undefined) {

            send404(res);
            console.log('the question does not exist');
        }else {
            //save the answer if question exists
            console.log('the question exists, lets save your answer');
            pool.query("INSERT INTO answers(user_id, linked_question_id, answer_text, created_at) VALUES('"+userId+"', '"+questionId+"', '"+answer+"', '"+timestamp+"');", [],(err,result)=>{
                if(err){
                    console.log(err);
                    send400(res);
                }
                send200(res);
            });
        }

    })();
});


 /*
 * @oas [put] /api/v1/questions/answers/:answerId
 * description: "mark an answer as accepted"
 * parameters:
 *   - (path) questions answer
 *   - (query result) 0
     - (answer id)the id of the answer you want to mark as accepted
     - (question id) id of the question that has the answer
     - (user id) id of the user attempting this action
*/

//Mark an answer as  accepted or  update an answer.
//This endpoint is available to  only the answer author and question 
// author. The answer author calls the  route to
// update answer while the  question author calls the route to  accept answer.
router.put('/answers/:answerId', verifyToken, (req, res)=>{
    const questionId = req.body.question_id;
    const answerId = req.body.answer_id;
    const userId = req.body.user_id;
    const time =  new Date().toLocaleString();
    console.log('lets check for the requested question');
    pool.query("SELECT user_id FROM questions where id = '"+questionId+"' ", [],(err,result)=>{
        if(err){
            console.log(err);
            console.log('could not find the question');
            send404(res);
        }else {
            console.log(result);
            //mark answer as accepted
            if(result['rows'][0]['user_id'] === userId){
                pool.query("UPDATE answers SET selected_at = '"+time+"' where id = '"+answerId+"' ", [], (err,result)=>{
                    if(err) {
                        console.log(err);
                        console.log('action failed');
                       send404(res);
                    }else {
                        console.log('action completed');
                        send200(res);
                    }
                }); //end function to mark answer as selected

                console.log(result['rows'][0]['user_id']);

            }else {
                res.status(401).send('access denied');
            }

        }
    });

});


module.exports = router;