const Request = require('request');

describe("server", ()=>{
    var server;
    beforeAll(()=>{
        server = require("../app");
    });
    afterAll(()=>{
        server.close();
    });
    describe("GET /", ()=>{
        let data = {};
        beforeAll((done)=>{
            Request.get("http://localhost:3000", (error, response, body)=>{
                data.status = response.statusCode;
                data.body = body;
                done();

            });
        });
        it('should be able to verify user information', ()=>{
            expect(data.status).toBe(200);
        });
    })
});