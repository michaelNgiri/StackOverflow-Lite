//send a http status:401 and a descriptive messages to the client
//this helper function is called on user access denied case

const send = require('./responseJSON');

function send401(res, msg) {
    return send(res, 401, msg);
}

module.exports=send401;