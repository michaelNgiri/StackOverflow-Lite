const Request = require('request');

describe("server", ()=>{
    var server;
    beforeAll(()=>{
        server = require("../app");
    });
    // afterAll(()=>{
    //     server.close();
    // });

    describe('useless api endpoint', function() {
        before(function(done) {
            request.post('/auth/signup')
                .send({
                        email: 'test@user.com',
                    password: 'password'
                })
        .end(
            // function(err, res) {
            //     if (err) throw err;
            //     token = { access_token: res.body.token }
            //     done();
            // }
            );
        });

        it('posts an object', function(done) {
            request.post('/api/useless')
                .send({ property: value })
                .query(token)
                .expect(201)
                .end(function(err, res) {
                    should(err).equal(null);
                    done()
                });
        });
    });

    //     describe("POST /auth/signup", ()=>{
    //         let data = {
    //             email:"mike101@me.com",
    //             password:"password"
    //         };
    //         beforeAll((done)=>{
    //             Request.get("http://localhost:3000", (error, response, body)=>{
    //                 data.status = response.statusCode;
    //                 data.body = body;
    //                 done();
    //
    //             });
    //         });
    //         it('should be able to verify user information', ()=>{
    //             expect(data.status).toBe(200);
    //         });
    //     })
});