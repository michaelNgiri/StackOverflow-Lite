//send a http status:200 and a descriptive messages to the client
//this helper function is called on page not found case

const send = require('./responseJSON');

function send404(res, msg) {
    return send(res, 404, msg);
}

module.exports=send404;