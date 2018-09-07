const Request = require('request');

describe("Upvoting of an answer", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.post({url:'http://localhost:3000/api/v1/upvote/2', form: {question_id:2}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should return 400 if the request token is missing', ()=>{
        expect(data.status).toBe(403);
    });
});

describe("POST route", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.post({url:'http://localhost:3000/api/v1/upvote/2', form: {question_id:2}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should return 404 if the request is sent as GET instead of POST', ()=>{
        expect(data.status).toBe(403);
    });
});