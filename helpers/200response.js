function send200(res, msg) {
    res.status(200).json({
        status: 200,
        message: msg
    });
}
module.exports=send200;