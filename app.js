const express = require('express');
const app = express();

require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');
// swagger definition
const swaggerDefinition = {
    info: {
        title: 'Node Swagger API',
        version: '1.0.0',
        description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:3000',
    basePath: '/',
};
// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./**/routes/*.js','routes.js'],// pass all in array
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);


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



app.get('/', (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

/**
 * @swagger
 * /api/v1/:
 *   get:
 *     tags:
 *       - users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/users'
 */
app.get('/api/v1/', (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
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

