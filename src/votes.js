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


router.post('/upvote/:answerId', verifyToken, (req, res)=>{
    const userId =  req.body.user_id;
    const answerId = req.body.answer_id;
    const timestamp =  new Date().toLocaleString();

        pool.query("INSERT INTO upvotes(user_id, answer_id, created_at) VALUES('"+userId+"', '"+answerId+"', '"+timestamp+"'); ", [], (err,result)=>{
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
});




//downvoting of answers
router.post('/downvote/:answerId', verifyToken, (req, res)=>{
    const userId = 1;// req.body.user_id;
    const answerId = 1;//req.body.answer_id;
    const time =  new Date().toLocaleString();

    pool.query("INSERT INTO downvotes(user_id, answer_id, created_at) VALUES('"+userId+"', '"+answerId+"', '"+time+"'); ", [],(err,result)=>{
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

});

module.exports = router;