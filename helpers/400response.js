//send a http status:400 and a descriptive messages to the client
//this helper function is called when an authentication/authorization error is encountered

const send = require('./responseJSON');

function send400(res, msg) {
    return send(res, 400, msg);
}

module.exports=send400;