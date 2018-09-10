function send400(res) {
    res.status(400).json({
        status: 400,
        message: "could not complete the requested action, try later"
    });
}

module.exports=send400;