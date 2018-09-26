function send401(res, msg) {
    res.status(401).json({
        status: 401,
        message: msg
    });
}

module.exports=send401;