const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();
const config = require('../db/db-string');
const verifyToken = require('../middlewares/verifyToken');

const Pool = require('pg').Pool;


const pool = new Pool(config);


router.post('/upvote/:answerId', verifyToken, (req, res)=>{
    const table ='upvotes';
    const userId =  req.body.user_id;
    const answerId = req.body.answer_id;
    const timestamp =  new Date().toLocaleString();
    const queryString = "INSERT INTO upvotes(user_id, answer_id, created_at) VALUES('"+userId+"', '"+answerId+"', '"+timestamp+"') ";

    vote(res, queryString);

});




//downvoting of answers
router.post('/downvote/:answerId', verifyToken, (req, res)=>{
    const table = 'downvotes';
    const userId = req.body.user_id;
    const answerId = req.body.answer_id;
    const time =  new Date().toLocaleString();
    const queryString = "INSERT INTO downvotes(user_id, answer_id, created_at) VALUES('"+userId+"', '"+answerId+"', '"+timestamp+"') ";
        vote(res, queryString);


});

module.exports = router;

function vote(res, queryString) {
    console.log(queryString);
    pool.query(queryString, [], (err,result)=>{
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
    });

}