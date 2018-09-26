function send503(res, msg) {
    res.status(503).json({
        status: 503,
        message: msg
    });
}

module.exports=send503;