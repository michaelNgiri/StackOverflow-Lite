//send a http status:401 and a descriptive messages to the client
//this helper function is called on user access denied case
function send401(res, msg) {
    res.status(401).json({
        status: 401,
        message: msg
    });
}

module.exports=send401;