//send a http status:503 and a descriptive messages to the client
//called when the api host is out of service
function send503(res, msg) {
    res.status(503).json({
        status: 503,
        message: msg
    });
}

module.exports=send503;