//send a http status:503 and a descriptive messages to the client
//called when the api host is out of service

const send = require('./responseJSON');

function send503(res, msg) {
    return send(res, 503, msg);
}

module.exports=send503;