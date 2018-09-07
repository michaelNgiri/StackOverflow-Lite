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