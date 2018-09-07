const Request = require('request');

describe("Posting of questions", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.post({url:'http://localhost:3000/api/v1/questions'}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should return 403 if the user does not have the request token', ()=>{
        expect(data.status).toBe(403);
    });
});

describe("Retrieving of all questions", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.get({url:'http://localhost:3000/api/v1/questions'}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should return 200 if questions exist in database', ()=>{
        expect(data.status).toBe(200);
    });
});

describe("Retrieving of a single question", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.get({url:'http://localhost:3000/api/v1/questions/1', form: {question_id:2}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should return 200 if the question id exist in database', ()=>{
        expect(data.status).toBe(200);
    });
});

describe("Retrieving of a single question", ()=>{
    let data = {};
    const questionId = 12000;
    beforeAll((done)=>{
        Request.get({url:'http://localhost:3000/api/v1/questions/3', form: {question_id:questionId}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should return 404 if the question id does not exist in database', ()=>{
        expect(data.status).toBe(404);
    });
});
