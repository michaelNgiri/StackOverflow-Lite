//db queries

// pool.query("INSERT INTO users(first_name, last_name, email) values('mike','mikeom','mike@mike.com')");
// pool.query("INSERT INTO users(first_name, last_name, email) values('mike2','mikeom','mike@mike.com')");

// let fname = 'first_name';
// let lname = 'last_name';
// let email = 'mailer@me.com';
//
// pool.query("INSERT INTO users(first_name, last_name, email) VALUES('"+fname+"', '"+lname+"', '"+email+"');");
}

// async function insert_a_user(){
// 	//var response = await pool.query("select * from users");
// 	pool.query("INSERT INTO users(id SERIAL PRIMARY KEY, name TEXT, link TEXT, email TEXT);");
// 	pool.query("CREATE TABLE IF NOT EXISTS questions(id SERIAL PRIMARY KEY, created_at TIMESTAMP,  updated_at TIMESTAMP, link TEXT, senderId TEXT, sendermsg TEXT, senderName TEXT, receiverId TEXT);");
// 	pool.query("CREATE TABLE IF NOT EXISTS answers(id SERIAL PRIMARY KEY, created_at TIMESTAMP, updated_at TIMESTAMP, link TEXT, senderId TEXT, sendermsg TEXT, senderName TEXT, receiverId TEXT)");
// 	console.log("successful");
// }



//var response = await pool.query("select * from users");


user validation

// function validUserInfo(user){
//     const validEmail = typeof user.email === "string" && user.email.trim() !== '';
//     const validPassword = typeof user.password === "string" && user.password.trim() !== '' && user.password.trim() > 5;
//
//     console.log(validEmail + user.email);
//     console.log(validPassword);
//     console.log(user.password);
//     return validEmail && validPassword;
// }

async function userExists(user) {
    const email = user.email;
    pool.query("SELECT * FROM users WHERE email = '" + email + "' ", [], function (err, result) {
        if (err) {
            // pass the error to the express error handler
            return next(err)
        }
// console.log(noOfUsers);
// if (noOfUsers !== 0){
//     return true;
// }else {
//     return false;
// }


// const query = pool.query("SELECT * FROM users WHERE email = '" + email + "' ", (err, res) => {
//     console.log(err ? err.stack : res.rows[0]); // Hello World!
// });
// console.log(query);
// return query != null;






login queries
        (async () => {

            const { rows } = await pool.query("SELECT password FROM users WHERE email = '"+email+"' ")

            if ({ rows }.length < 1) {

                console.log('this email is not registered');

            }else {
                const dbPassword = rows[0].password;

                console.log(dbPassword);

                console.log(result);
                console.log('email exists, lets see if your password is correct');
                // bcrypt.compare(req.body.password, result.password).then(function (result) {
                //     console.log(result);
                // });
            }
        })()



        {
            STATUS_CODES:
            { '100': 'Continue',
                '101': 'Switching Protocols',
                '102': 'Processing',
                '103': 'Early Hints',
                '200': 'OK',
                '201': 'Created',
                '202': 'Accepted',
                '203': 'Non-Authoritative Information',
                '204': 'No Content',
                '205': 'Reset Content',
                '206': 'Partial Content',
                '207': 'Multi-Status',
                '208': 'Already Reported',
                '226': 'IM Used',
                '300': 'Multiple Choices',
                '301': 'Moved Permanently',
                '302': 'Found',
                '303': 'See Other',
                '304': 'Not Modified',
                '305': 'Use Proxy',
                '307': 'Temporary Redirect',
                '308': 'Permanent Redirect',
                '400': 'Bad Request',
                '401': 'Unauthorized',
                '402': 'Payment Required',
                '403': 'Forbidden',
                '404': 'Not Found',
                '405': 'Method Not Allowed',
                '406': 'Not Acceptable',
                '407': 'Proxy Authentication Required',
                '408': 'Request Timeout',
                '409': 'Conflict',
                '410': 'Gone',
                '411': 'Length Required',
                '412': 'Precondition Failed',
                '413': 'Payload Too Large',
                '414': 'URI Too Long',
                '415': 'Unsupported Media Type',
                '416': 'Range Not Satisfiable',
                '417': 'Expectation Failed',
                '418': 'I\'m a teapot',
                '421': 'Misdirected Request',
                '422': 'Unprocessable Entity',
                '423': 'Locked',
                '424': 'Failed Dependency',
                '425': 'Unordered Collection',
                '426': 'Upgrade Required',
                '428': 'Precondition Required',
                '429': 'Too Many Requests',
                '431': 'Request Header Fields Too Large',
                '451': 'Unavailable For Legal Reasons',
                '500': 'Internal Server Error',
                '501': 'Not Implemented',
                '502': 'Bad Gateway',
                '503': 'Service Unavailable',
                '504': 'Gateway Timeout',
                '505': 'HTTP Version Not Supported',
                '506': 'Variant Also Negotiates',
                '507': 'Insufficient Storage',
                '508': 'Loop Detected',
                '509': 'Bandwidth Limit Exceeded',
                '510': 'Not Extended',
                '511': 'Network Authentication Required' },
        }
    }



    const Request = require('request');
    let data = {}
//hint: start the server before running the test
    describe("Register a user", ()=>{
        beforeAll((done)=>{
            Request.post({url:'http://localhost:3000/auth/signup', form: {email:'value@valuecreator.com', password:"password"}}, function(err,httpResponse,body){
                console.log(httpResponse);
            });
            done();
        });
        console.log(data.status);
        it('should be able to verify user information', ()=>{
            expect(data.status).toBe(200);
        });



    });