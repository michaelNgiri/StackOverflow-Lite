const Request = require('request');
require('dotenv').config();
const url = process.env.SITE_URL;
const port = process.env.PORT || 3000;

        describe("User Registration Form", ()=>{
            let data = {};
            beforeAll((done)=>{
                Request.post({url:url+'/api/v1/auth/signup', form: {email:'email@email.com', password:"password"}}, function(err,httpResponse,body){
                    console.log(httpResponse['statusCode']);
                    data.status = httpResponse['statusCode'];
                    done();
                });
            });
            it('should return 400 http response if email already exists', ()=>{
                expect(data.status).toBe(409);
            });
        });

     /////////////////////////////////////////////////////////
    //this test can only pass once
    //////////////////////////////////
// describe("User Registration Form", ()=>{
//     let data = {};
//     beforeAll((done)=>{
//         Request.post({url:'http://localhost:3000/auth/signup', form: {email:'email@emailhhhh.com', password:"password"}}, function(err,httpResponse,body){
//             console.log(httpResponse['statusCode']);
//             data.status = httpResponse['statusCode'];
//             done();
//         });
//     });
//     it('should register a new user if the information dont exist', ()=>{
//         expect(data.status).toBe(200);
//     });
// });



//test for invalid registration details
describe("User Registration Form", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.post({url:url+'/api/v1/auth/signup', form: {email:'email@email.com', password:""}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should reject invalid form data for registration', ()=>{
        expect(data.status).toBe(418);
    });
});


describe("User Registration Form", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.post({url:url+'/api/v1/auth/signup', form: {email:'email@email.com', password:""}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should reject invalid form data for registration', ()=>{
        expect(data.status).toBe(418);
    });
});



//test login details when info is valid
describe("Login Form", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.post({url:url+'/api/v1/auth/login', form: {email:'email@email.com', password:"password"}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should be able to login a user with valid details', ()=>{
        expect(data.status).toBe(200);
    });
});


//test the login route for invalid details
describe("User Login", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.post({url:url+'/api/v1/auth/login', form: {email:'email@x.com', password:""}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should reject invalid form data for login', ()=>{
        expect(data.status).toBe(401);
    });
});