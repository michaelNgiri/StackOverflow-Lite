const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');


const Pool = require('pg').Pool;
const config = {
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'stack-lite',
};
const pool = new Pool(config);



app.get('/', function (req, res) {
    (async () => {
        const { rows } = await pool.query("SELECT * FROM questions");
        const result = rows;
        res.status(200).json(result);
    })()
});




//Fetch a specific  question 
//This should come with all the  answers  provided so far for the question. 
app.get(':questionId', (req, res)=>{
    //const questionId = req.body.questionId
    let questionAnswers = [];
   let questionId=req.params.questionId;
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
app.post('/', verifyToken, (req, res)=>{
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
app.delete('/:questionId', function (req, res) {
const questionId = req.params.questionId;
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
