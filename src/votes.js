const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();
const config = require('../db/db-string');
const verifyToken = require('../middlewares/verifyToken');

//enable cors
router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers","*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

const Pool = require('pg').Pool;
const pool = new Pool(config);


const send400= require('../helpers/400response');
const send200= require('../helpers/200response');

/*
 * @oas [get] /api/v1/votes/upvote/:answerId
 * description: "upvote an answer"
 * parameters:
 *   - (path)  answer
 *   - (query) 0
     - (answer id)the id of the answer you want to upvote
     - (user id) id of the user attempting this action
*/
router.post('/upvote/:answerId', verifyToken, (req, res)=>{
    const table ='upvotes';
    const userId =  req.body.user_id;
    const answerId = req.body.answer_id;
    const timestamp =  new Date().toLocaleString();
    const queryString = "INSERT INTO upvotes(user_id, answer_id, created_at) VALUES('"+userId+"', '"+answerId+"', '"+timestamp+"') ";

    vote(res, queryString);

});



/*
 * @oas [get] /api/v1/votes/downvote/:answerId
 * description: "downvote an answer"
 * parameters:
 *   - (path)  answer
 *   - (query) 0
     - (answer id)the id of the answer you want to downvote
     - (user id) id of the user attempting this action
*/
//downvoting of answers
router.post('/downvote/:answerId', verifyToken, (req, res)=>{
    send400(res);
    const table = 'downvotes';
    const userId = req.body.user_id;
    const answerId = req.body.answer_id;
    const time =  new Date().toLocaleString();
    const queryString = "INSERT INTO downvotes(user_id, answer_id, created_at) VALUES('"+userId+"', '"+answerId+"', '"+time+"') ";
        vote(res, queryString);


});


function vote(res, queryString) {
    console.log(queryString);
    pool.query(queryString, [], (err,result)=>{
        if(err) {
            send400(res);
        }else {
            console.log('action completed');
            send200(res);
        }
    });

}


module.exports = router;