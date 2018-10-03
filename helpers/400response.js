//send a http status:400 and a descriptive messages to the client
//this helper function is called when an authentication/authorization error is encountered
function send400(res, msg) {
    res.status(400).json({
        status: 400,msg
    });
}

module.exports=send400;