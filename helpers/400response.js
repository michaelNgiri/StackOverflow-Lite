function send400(res, msg) {
    res.status(400).json({
        status: 400,msg"could not complete the requested action, try later"
    });
}

module.exports=send400;