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


 /*
 * @oas [get] /
 * description: "The API base url or home page"
 * parameters:
*/
app.get('/', (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.send('welcome to stackoverflow-lite');
});

 /*
 * @oas [get] /
 * description: "The API base url or home page"
*/
app.get('/api/v1/', (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});



 /*
 * @oas [get] /api/v1/index.html
 * description: "The API base url or home page"
*/
app.get('/api/v1/index.html', (req, res)=>{
        res.sendFile(__dirname + "/" + "index.html");
    });





app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    console.log('server started at port: ' + port);
});

