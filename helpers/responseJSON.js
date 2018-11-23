//send a http status:503 and a descriptive messages to the client
//called when the api host is out of service
function send(res, status, msg) {
    res.status(status).json({
        status,
        msg
    });    
}

module.exports=send;