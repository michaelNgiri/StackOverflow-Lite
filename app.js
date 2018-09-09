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
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/questions', questionsRoute);
app.use('/api/v1/votes', votesRoute);





app.get('/api/v1/', (req, res)=>{
    console.log(req.headers);
    res.status(200).send(req.headers);
});




app.get('/api/v1/index.html', (req, res)=>{
        res.sendFile(__dirname + "/" + "index.html");
    });





app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    console.log('server started at port: ' + port);
});

