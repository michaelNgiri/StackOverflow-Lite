//send a http status:200 and a descriptive messages to the client
//called only when a request is succesful
function send200(res, msg) {
    res.status(200).json({
        status: 200,
        message: msg
    });
}
module.exports=send200;