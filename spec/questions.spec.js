const Request = require('request');

describe("Posting of questions", ()=>{
    let data = {};
    beforeAll((done)=>{
        Request.post({url:'http://localhost:3000/questions', form: {email:'email@email.com', password:"password"}}, function(err,httpResponse,body){
            console.log(httpResponse['statusCode']);
            data.status = httpResponse['statusCode'];
            done();
        });
    });
    it('should return 403 if the user does not have the request token', ()=>{
        expect(data.status).toBe(403);
    });
});
