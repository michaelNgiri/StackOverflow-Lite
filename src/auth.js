const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
require('dotenv').config();
const config = require('../db/db-string');
const userInfoIsValid = require('../middlewares/verifyUserInfo');

const cors = require('cors');
router.use(cors());


const send400= require('../helpers/400response');
const send200= require('../helpers/200response');
const send401= require('../helpers/401response');
const send503= require('../helpers/503response');

const Pool = require('pg').Pool;

const pool = new Pool(config);

 /*
 * @oas [get] /api/v1/auth/login
 * description: "The login route"
 * parameters:
 *   - (email) The email used to register
 *   - (pasword) returns user info including token, user id, email, cookie
*/
router.post('/login', function (req, res) {
    const {email} = req.body;
    //return authentication failure error
    if (!userInfoIsValid(req.body)) send401(res, "the info you submitted does not seem to be right");

    pool.query("SELECT password FROM users WHERE email = '"+email+"' ", [], function (err, result) {
        if (err || result === undefined) send503(res, "Temporarily out of service, try logging in again later");

        if (result.rows.length < 1) send401(res, "this email is not registered");
        
        (async () => {
            const { rows } = await pool.query("SELECT * FROM users WHERE email = '"+email+"' ");
            const dbPassword = rows[0].password;
            const id = rows[0].id;
            const firstName = rows[0].first_name;
            const lastName = rows[0].last_name;

            //compare password sent by user with one in db
            const match = await bcrypt.compare(req.body.password, dbPassword);

            //const secureCookie = req.app.get('env') !== 'development';
            //return authentication failure error
            if(!match) send401(res, "invalid email or password");

            //login the user
            const user = {email, id, lastName, firstName};

            jwt.sign({user}, 'secret_key',{expiresIn:'30000s'}, (err, token)=>{
                //set cookies
                const authToken = token;
                
                //signed:true,secure:secureCookie
                res.cookie( 'Authorization',authToken, 'id', id, {httpOny:true});
                
                // res.headers({Authorization:token, id:id});
                res.status(200).json({
                    status:200,
                    message: "success, you are logged in",
                    Authorization:authToken,
                    user:user,
                });
            });
        })();
    });
});

 /*
 * @oas [get] /api/v1/auth/signup
 * description: "The route for signup"
 * parameters:
 *   - (path) signup
*/
router.post('/signup', function(req, res) {
    //feedback to the user if the information supplied is invalid
    if(!userInfoIsValid(req.body)) res.status(418).send('invalid info submitted');

    //res.sendStatus(200);
    //call the function for validating user inputs
    let userInfo = req.body;
    const firstName = userInfo.first_name;
    const lastName = userInfo.last_name;
    const email = userInfo.email;
    const password = userInfo.password;
    //check if the email supplied exists in database
    pool.query("SELECT * FROM users WHERE email = '" + email + "' ", [], function (err, result) {
        if(err) send400(res, 'user does not exist');

        //give a feedback to the user if email is already in use
        if(result.rows.length > 1 || result.rows.length !== undefined) res.status(409).send('email in use');

        bcrypt.hash(password, 8).then(function (hashedPassword) {
            //insert the user to database if not already registered
            pool.query("INSERT INTO users(first_name, last_name, email, password) VALUES('"+firstName+"', '"+lastName+"', '"+email+"', '"+hashedPassword+"');", function(err, queryResult) {
                send200(res, 'registration successful');
            });
        });
    });
});

module.exports=router;