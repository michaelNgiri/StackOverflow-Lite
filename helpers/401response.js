function send401(res) {
    res.status(401).json({
        status: 401,
        message: "could not complete the requested action, try later"
    });
}

module.exports=send401;