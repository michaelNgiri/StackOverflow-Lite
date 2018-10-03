//send a http status:200 and a descriptive messages to the client
//this helper function is called on page not found case
function send404(res, msg) {
    res.status(404).json({
        status: 404,
        message: msg
    });
}

module.exports=send404;