const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
require('dotenv').config();
const config = require('../db/db-string');
const verifyToken = require('../middlewares/verifyToken');

const Pool = require('pg').Pool;


const pool = new Pool(config);

//Fetch all questions 
router.get('/', (req, res)=>{
    (async () => {
        const { rows } = await pool.query("SELECT * FROM questions");
        const result = rows;
        res.status(200).json(result);
    })()
});

router.get('/recent', (req, res)=>{
    (async () => { 
    	console.log('fetching the latest question');
        const { rows } = await pool.query("select * from questions where id != 0 order by created_at desc limit 3");
        console.log(rows);
        const result = rows;
        res.status(200).json(result);
    })()
});


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

            res.status(404).json({
                status:404,
                message:'the question does not exist'
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
                }else {  questionAnswers = rows[0]; }
                res.status(200).json({
                    status:200, question:question, answers:questionAnswers
                })
            })()
        }

    })();
});


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
            res.status(400).json({
                status:400,
                message:"could not save your question, try later"
            });
        }else{
        	res.status(200).json({
            status: 200,
            //result:result.rows
        });
        }
        
    });

});




//Delete a question
//This endpoint should be available to  the author of the question. 
router.delete('/:questionId', (req, res)=>{
const questionId = req.body.question_id;
    pool.query("DELETE FROM questions where id = '"+questionId+"' ", [],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                status:400,
                message:'cant delete, the question does not exist'
            });
        }
        res.status(200).send('question deleted');
    });
});


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

            res.status(404).json({
                status:404,
                message:'the question does not exist'
            });
            console.log('the question does not exist');
        }else {
            //save the answer if question exists
            console.log('the question exists, lets save your answer');
            pool.query("INSERT INTO answers(user_id, linked_question_id, answer_text, created_at) VALUES('"+userId+"', '"+questionId+"', '"+answer+"', '"+timestamp+"');", [],(err,result)=>{
                if(err){
                    console.log(err);
                    res.status(400).json({
                        status:400,
                        message:'unable to save your answer, try again later'
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
            res.status(400).json({
                status:400,
                message:"could not find the question, try later"
            });
        }else {
            console.log(result);
            //mark answer as accepted
            if(result['rows'][0]['user_id'] === userId){
                pool.query("UPDATE answers SET selected_at = '"+time+"' where id = '"+answerId+"' ", [], (err,result)=>{
                    if(err) {
                        console.log(err);
                        console.log('action failed');
                        res.status(400).json({
                            status: 400,
                            message: "could not complete the requested action, try later"
                        });
                    }else {
                        console.log('action completed');
                        res.status(200).json({
                            status: 200,
                            message: "succesful!"
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

module.exports = router;