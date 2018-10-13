const Request = require('request');
require('dotenv').config()
let url;
if (process.env.APP_ENV === 'local'){
    url = process.env.LOCAL_SERVER
}else{
    url = process.env.SITE_URL;
}

describe("Upvoting of an answer", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.post({url:url+'/api/v1/votes/upvote/1', form: {question_id:2}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should return 403 if the request token is missing or wrong', ()=>{
        expect(data.status).toBe(403);
    });
});

describe("POST route", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.post({url:url+'/api/v1/upvote/2', form: {question_id:2}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should return 404 if the request is sent as GET instead of POST', ()=>{
        expect(data.status).toBe(404);
    });
});