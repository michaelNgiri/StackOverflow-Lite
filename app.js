const express = require('express');
const app = express();

// const http = require('http'),
//     fs = require('fs');

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


app.use('/api/v1/auth', authRoute);
app.use('/api/v1/questions', questionsRoute);
app.use('/api/v1/votes', votesRoute);


const send200= require('./helpers/200response');

 /*
 * @oas [get] /
 * description: "The API base url or home page"
 * parameters:
*/
// app.get('/', (req, res)=>{
//     res.setHeader('Content-Type', 'text/html');
//     res.status(200).sendFile(__dirname + "/" + "docs/index.html");

// });//content-type: ; charset=utf-8

//Will move to this page
app.get('/swagger_json', (req, res)=>{
    res.setHeader('Content-Type', 'text/html');
    res.status(200).sendFile(__dirname + "/" + "docs/swagger.json");

});
 /*
 * @oas [get] /
 * description: "The API base url or home page"
*/
app.get('/api/v1/', (req, res)=>{
//     fs.readFile('./index.html', function (err, html) {
//     if (err) {
//         throw err; 
//     }         
//         response.writeHeader(200, {"Content-Type": "text/html"});  
//         response.write(html);  
//         response.end();  
// });
});





//It will start listening to this particular port number specified by the variable port
app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    console.log('server started at port: ' + port);
});

