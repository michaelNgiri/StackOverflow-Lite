function send404(res, msg) {
    res.status(404).json({
        status: 404,
        message: msg
    });
}

module.exports=send404;