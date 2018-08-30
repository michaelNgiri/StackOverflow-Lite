var express = require('express');
var app = express();
var port = process.env.PORT || 3000;


app.get('/', function (req, res) {
	res.send("hi, this is StackOverflow Lite");
});

const users = [
	{'id':1},
	{'name':"myname"}
];
//Register a user 
app.post('/auth/signup', function (req, res) {
    client.query(
        `INSERT INTO users (name, link, email) VALUES ('')`,
        (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                done(null, {rows:[{name:profile.displayName,link:shortId,email:pro_email}]});
            }
        }
    );
    res.status(404).send('not today');
    //res.send(users);
});

//Login a user 
app.post('/auth/login', function (req, res) {
    res.send("hi there");
});
 
//Fetch all questions 
app.get('/questions', function (req, res) {
	res.send("StackOverflow Lite");
});

//Fetch a specific  question 
//This should come with all the  answers  provided so far for the question. 
app.get('/questions/<questionId>', function (req, res) {
	res.send("StackOverflow Lite");
});

//Post a question 
app.post('/questions', function (req, res) {
    res.send("hi there");
});

//Delete a question
//This endpoint should be available to  the author of the question. 
app.delete('/questions/<questionId>', function (req, res) {
	res.send("StackOverflow Lite");
});

//Post an answer to  a question
app.post('/questions/<questionId>/answers', function (req, res) {
    res.send("hi there");
});

//Mark an answer as  accepted or  update an answer.
//This endpoint should be available to  only the answer author and question 
// author. The answer author calls the  route to
// update answer while the  question author calls the route to  accept answer.
app.put('/questions/<questionId>/answers/<answerId>', function (req, res) {
    res.send("hi there");
});



//app.use(express.static(public));

app.listen(port, function(err){
	console.log('server started at port: ' + port);
});