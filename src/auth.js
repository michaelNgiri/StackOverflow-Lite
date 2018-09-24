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
    const email = req.body.email;
    console.log(email);
    if (userInfoIsValid(req.body)) {
        pool.query("SELECT password FROM users WHERE email = '"+email+"' ", [], function (err, result) {
            console.log(result.rows.length);
            if (result.rows.length < 1) {
                send401(res);
                console.log('this email is not registered');

            }else {
                (async () => {
                    const { rows } = await pool.query("SELECT * FROM users WHERE email = '"+email+"' ");
                    const dbPassword = rows[0].password;
                    const id = rows[0].id;
                    const firstName = rows[0].first_name;
                    const lastName = rows[0].last_name;
                    console.log('email exists, lets see if your password is correct');

                    //compare password sent by user with one in db
                    const match = await bcrypt.compare(req.body.password, dbPassword);
                    //const secureCookie = req.app.get('env') !== 'development';
                    if(match){
                        console.log('password is correct lets log you in');
                        //login the user
                        const user = {
                            email:email,
                            id:id,
                            lastName:lastName,
                            firstName:firstName
                        };

                        jwt.sign({user}, 'secret_key',{expiresIn:'30000s'}, (err, token)=>{
                            //set cookies
                            const authToken = token;
                            res.cookie( 'Authorization',authToken, 'id', id, {
                                httpOny:true,
                                //signed:true,
                                //secure:secureCookie
                            });
                            // res.headers({
                            //    Authorization:token,
                            //     id:id
                            // });
                            res.status(200).json({
                                status:200,
                                message: "success, you are logged in",
                                Authorization:authToken,
                                user:user
                            })
                        });
                    }else {
                        //return authentication failure error
                        send401(res);
                    }
                })()
            }
        });
    }else {
        //return authentication failure error
        send401(res);
    }
});




 /*
 * @oas [get] /api/v1/auth/signup
 * description: "The route for signup"
 * parameters:
 *   - (path) signup
*/
router.post('/signup', function(req, res) {
    //res.sendStatus(200);
    //call the function for validating user inputs
    if(userInfoIsValid(req.body)){
        console.log('valid info submitted');
        let userInfo = req.body;
        const firstName = userInfo.first_name;
        const lastName = userInfo.last_name;
        const email = userInfo.email;
        const password = userInfo.password;
        console.log('check if the email supplied exists in database');
        //check if the email supplied exists in database
        pool.query("SELECT * FROM users WHERE email = '" + email + "' ", [], function (err, result) {
           console.log(result.rows.length);
            if (!err) {
                if(result.rows.length<1 || result.rows.length === undefined){
                bcrypt.hash(password, 8).then(function (hashedPassword) {
                    //insert the user to database if not already registered
                    console.log('insert the user to database if not already registered');
                    pool.query("INSERT INTO users(first_name, last_name, email, password) VALUES('"+firstName+"', '"+lastName+"', '"+email+"', '"+hashedPassword+"');", function(err, queryResult) {
                        console.log(queryResult);
                        send200(res);
                        console.log('registration successful')
                    });
                });

            }else {
                console.log('email already registered');
                //give a feedback to the user if email is already in use
                res.status(409).send('email in use');
            }
        }else{
            send400(res);
        }
        });
    }else {
        //feedback to the user if the information supplied is invalid
        console.log('invalid info submitted');
        console.log('send a 500 code');
        res.status(418).send('invalid info submitted');
    }
});


module.exports=router;