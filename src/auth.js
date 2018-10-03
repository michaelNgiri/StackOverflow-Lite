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
const message= require('../helpers/messageForAuth')

const Pool = require('pg').Pool;


const pool = new Pool(config);


 /*
 * @oas [get] /api/v1/auth/login
 * description: "The login route"
 * parameters:
 *   - (email) The email used to register
 *   - (pasword) returns user info including token, user id, email, cookie
*/
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        if (userInfoIsValid(req.body)) {

            const result = await pool.query("SELECT password FROM users WHERE email = '"+email+"' ", []);
            if (result.rows.length < 1) {
                send401(res, message.emailNotRegistered);
            }else {
                const { rows } = await pool.query("SELECT * FROM users WHERE email = '"+email+"' ");
                const dbPassword = rows[0].password;
                const user = {
                    email,
                    id: rows[0].id,
                    lastName: rows[0].last_name,
                    firstName: rows[0].first_name 
                };

                //compare password sent by user with one in db
                const match = await bcrypt.compare(req.body.password, dbPassword);
                //const secureCookie = req.app.get('env') !== 'development';
                if(match){
                    //login the user
                    const authToken = jwt.sign(user, 'secret_key',{expiresIn:'30000s'})
                    //set cookies
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
                        message: message.loginSuccess,
                        Authorization:authToken,
                        user:user
                    })
                }else {
                    //return authentication failure error
                    send401(res, message.invalidCredentials);
                }
            }       
        }else {
            //return authentication failure error
            send401(res, message.incorrectInfo);
        }
    }
    catch(err) {
        console.log(err);
        send503(res, message.errLogin);
    }
});


 /*
 * @oas [get] /api/v1/auth/signup
 * description: "The route for signup"
 * parameters:
 *   - (path) signup
*/
router.post('/signup', async (req, res) => {
    //res.sendStatus(200);
    //call the function for validating user inputs
    try {
        if(userInfoIsValid(req.body)){
            const { first_name, last_name, email, password } = req.body;
            const firstName = first_name
            const lastName = last_name

            //check if the email supplied exists in database
            const result = await pool.query("SELECT * FROM users WHERE email = '" + email + "' ", [])

            if(result.rows.length<1 || result.rows.length === undefined){
                const hashedPassword = await bcrypt.hash(password, 8)

                //insert the user to database if not already registered
                const insertQuery = "INSERT INTO users(first_name, last_name, email, password) VALUES('"+firstName+"', '"+lastName+"', '"+email+"', '"+hashedPassword+"');"
                const queryResult = await pool.query(insertQuery)
                send200(res, message.registrationSuccess);
            }else {
                //give a feedback to the user if email is already in use
                res.status(409).send(message.emailUsed);
            }
        }else {
            //feedback to the user if the information supplied is invalid
            res.status(418).send(message.incorrectInfo);
        }
    }
    catch(err) {
        console.log(err)
        send400(res, message.userNotExist);
    }
});


module.exports=router;