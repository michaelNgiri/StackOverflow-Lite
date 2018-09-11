const express = require('express');
const app = express();

require('dotenv').config();



const port = process.env.PORT || 3000;

//const path = require('path');

const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.COOKIE_SECRET));


const bodyParser = require('body-parser');

const authRoute = require('./src/auth');
const questionsRoute = require('./src/questions');
const votesRoute = require('./src/votes');
//configure body-parser for express
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use(function(req, res, next) {  
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Headers","*");
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      next();
 });

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/questions', questionsRoute);
app.use('/api/v1/votes', votesRoute);


const send200= require('../helpers/200response');

 /*
 * @oas [get] /
 * description: "The API base url or home page"
 * parameters:
*/
app.get('/', (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        status:200,
        msg:'welcome to stackoverflow-lite'
    });
});

 /*
 * @oas [get] /
 * description: "The API base url or home page"
*/
app.get('/api/v1/', (req, res)=>{
    send200(res);
});



 /*
 * @oas [get] /api/v1/index.html
 * description: "The API base url or home page"
*/
app.get('/', (req, res)=>{
        res.sendFile(__dirname + "/" + "index.html");
    });





app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    console.log('server started at port: ' + port);
});

