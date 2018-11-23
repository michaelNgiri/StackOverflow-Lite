const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();
const config = require('../db/db-string');
const verifyToken = require('../middlewares/verifyToken');

const cors = require('cors');
router.use(cors());


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
router.get('/', async (req, res)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM questions");
        res.status(200).json(rows);
    }
    catch(err) {
        res.status(504).json('Something went wrong, Try Again later');
    }
});

/*
 * @oas [get] /api/v1/questions/recent
 * description: "fetch the most recent question"
 * parameters:
 *   - (path) recent question
 *   - (query recult) 1
*/
//get the most recent question
router.get('/recent', async (req, res)=>{
    try{
        const { rows } = await pool.query("select * from questions where id != 0 order by created_at desc limit 1");
        res.status(200).json(rows);
    }
    catch(err) {
        res.status(504).json('Something went wrong, Try Again later');
    }
});


//get the most recent question answers
router.get('/recent/:id/answers', async (req, res)=>{
    try{
        const questionId = req.params.id;
        const { rows } = await pool.query("SELECT * FROM answers where linked_question_id = '"+questionId+"' ");
        if (rows.length < 1 || typeof rows.length === undefined) {
            questionAnswers = 'no answer yet';
        }else { 
            questionAnswers = rows[0];
        }
        res.status(200).json({
           status:200, answers:questionAnswers
        });
    }
    catch(err) {
        res.status(504).json('Something went wrong, Try Again later');
    }
});


//Gets the information of the user that made a question (first name, last name, email) using its userID
router.get('question/owner/:ownerId', async (req, res)=>{
    try{
        const userId = req.params.userId;
        const { rows } = await pool.query("select first_name, last_name, email from users where id = '"+userId+"' ");
        res.status(200).json(rows);
    }
    catch(err) {
        res.status(504).json('Something went wrong, Try Again later');
    }
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
router.get('/:questionId', async (req, res)=>{
    //const questionId = req.body.questionId
    try {
        let questionAnswers = [];
        const questionId=req.body.question_id;
        //check if the question with that id exists in database
        const { rows } = await pool.query("SELECT * FROM questions where id = '"+questionId+"' ");
        const question = rows[0];
        if (rows.length < 1 || rows.length === undefined) {
            const msg = 'the question does not exist';
            send404(res, msg);
        }else {
            //retrieve answers if question exists
            const { rows } = await pool.query("SELECT * FROM answers where linked_question_id = '"+questionId+"' ");
            if (rows.length < 1 || rows.length === undefined) {
                questionAnswers = 'no answer yet';
            }else {
                questionAnswers = rows[0];
            }
            res.status(200).json({
                status:200, question:question, answers:questionAnswers
            });
        }
    }
    catch(err) {
        res.status(504).json('Something went wrong, Try Again later');
    }
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
router.post('/', verifyToken, async (req, res)=>{
    try {
        // request received, lets try and save your question'
        const qTitle = req.body.question_title;
        const question = req.body.question;
        const userId = req.body.id;
        const timestamp =  new Date().toLocaleString();
        
        const result = await pool.query("INSERT INTO questions(user_id, question_title, question_body, created_at) VALUES('"+userId+"', '"+qTitle+"', '"+question+"', '"+timestamp+"');");
        const msg = 'question saved';
        send200(res, msg);
    }
	catch(err){
        console.log(err);
        const msg = 'could not save question';
        send400(res, msg);
    }

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
router.delete('/:questionId', verifyToken, async (req, res) => {
    try {
        const questionId = req.body.question_id;
        const result = await pool.query("DELETE FROM questions where id = '"+questionId+"' ", [])
        const msg = 'question deleted';
        send200(res, msg);
    }
    catch(err) {
        console.log(err);
        res.status(400).json({
            status:400,
            message:'cant delete, the question does not exist'
        });
    }
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
router.post('/answers', verifyToken, async (req, res)=>{
    try {
        const questionId = req.body.question_id;
        const answer = req.body.answer;
        const userId = req.body.user_id;
        const timestamp =  new Date().toLocaleString();
        //check if the question with that id exists in database before saving an answer to it
        const { rows } = await pool.query("SELECT * FROM questions where id = '"+questionId+"' ");
        const question = rows[0];
        //console.log(question.length)
        if (rows.length < 1 || rows.length === undefined) {
            const msg = 'the question does not exist';
            send404(res, msg);
        }else {
            //save the answer if question exists
            const result = await pool.query("INSERT INTO answers(user_id, linked_question_id, answer_text, created_at) VALUES('"+userId+"', '"+questionId+"', '"+answer+"', '"+timestamp+"');", []);
            const msg = 'saved';
            send200(res, msg);
        }
    }
    catch(err) {
        console.log(err);
        const msg = 'failed to save, try later';
        send400(res, msg);
    }
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
router.put('/answers/:answerId', verifyToken, async (req, res)=>{
    try {
        const questionId = req.body.question_id;
        const answerId = req.body.answer_id;
        const userId = req.body.user_id;
        const time =  new Date().toLocaleString();
        //lets check for the requested question
        const result = await pool.query("SELECT user_id FROM questions where id = '"+questionId+"' ", []);
            //mark answer as accepted
        if(result['rows'][0]['user_id'] === userId){
            const updateQueryresult = await pool.query("UPDATE answers SET selected_at = '"+time+"' where id = '"+answerId+"' ", [])
             //end function to mark answer as selected
            const msg = 'succesful';
            send200(res, msg);
        }else {
            res.status(401).send('access denied');
        }
    }
    catch(err) {
        console.log(err);
        const msg = 'could not find the question';
        send404(res, msg);
    }
});


module.exports = router;
