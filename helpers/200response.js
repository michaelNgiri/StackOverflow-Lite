//send a http status:200 and a descriptive messages to the client
//called only when a request is succesful

const send = require('./responseJSON');

function send200(res, msg) {
    return send(res, 200, msg);
}

module.exports=send200;