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


//Login a user 
router.post('/login', function (req, res) {
    const email = req.body.email;
    console.log(email);
    if (userInfoIsValid(req.body)) {
        pool.query("SELECT password FROM users WHERE email = '"+email+"' ", [], function (err, result) {
            console.log(result.rows.length);
            if (result.rows.length < 1) {
                console.log('this email is not registered');

            }else {
                (async () => {
                    const { rows } = await pool.query("SELECT password, id FROM users WHERE email = '"+email+"' ");
                    const dbPassword = rows[0].password;
                    const id = rows[0].id;
                    console.log('email exists, lets see if your password is correct');

                    //compare password sent by user with one in db
                    const match = await bcrypt.compare(req.body.password, dbPassword);
                    //const secureCookie = req.app.get('env') !== 'development';
                    if(match){
                        console.log('password is correct lets log you in');
                        //login the user
                        const user = {
                            email:email,
                            id:id
                        };

                        jwt.sign({user}, 'secret_key',{expiresIn:'30000s'}, (err, token)=>{
                            //set cookies
                            const authToken = token;
                            res.cookie( 'Authorization',authToken, {
                                httpOny:true,
                                //signed:true,
                                //secure:secureCookie
                            });
                            // res.headers({
                            //    Authorization:token
                            // });
                            res.json({
                                status:200,
                                message: "success, you are logged in",
                                Authorization:authToken,
                                id:id
                            })
                        });
                    }else {
                        //return authentication failure error
                        res.status(401).json({
                            status: 401,
                            msg: 'wrong password'
                        });
                    }
                })()
            }
        });
    }else {
        //return authentication failure error
        res.status(401).json({
            status: 401,
            msg: 'invalid login details, try again'
        });
    }
});




//Register a user 
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
            //console.log(result.rows.length);
            if(result.rows.length<1 || result.rows.length === undefined){
                bcrypt.hash(password, 8).then(function (hashedPassword) {
                    //insert the user to database if not already registered
                    console.log('insert the user to database if not already registered');
                    pool.query("INSERT INTO users(first_name, last_name, email, password) VALUES('"+firstName+"', '"+lastName+"', '"+email+"', '"+hashedPassword+"');", function(err, queryResult) {
                        console.log(queryResult);
                        res.status(200).send('registration successful');
                        console.log('registration successful')
                    });
                });

            }else {
                console.log('email already registered');
                //give a feedback to the user if email is already in use
                res.status(409).send('email in use');
            }
        });
    }else {
        //feedback to the user if the information supplied is invalid
        console.log('invalid info submitted');
        console.log('send a 500 code');
        res.status(418).send('invalid info submitted');
    }
});



function userInfoIsValid(user){
    if (typeof user.email === "string" &&
        user.email.trim() !== '' &&
        typeof user.password === "string" &&
        user.password.trim() !== '' &&
        user.password.trim().length >= 5) {
        // console.log(user.email);
        // console.log(user.password.trim());
        return true;
    }
    console.log(user);
    return false;
}
module.exports=router;