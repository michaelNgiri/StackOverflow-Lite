function send400(res, msg) {
    res.status(400).json({
        status: 400,msg
    });
}

module.exports=send400;