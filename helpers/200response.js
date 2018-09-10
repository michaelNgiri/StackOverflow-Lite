function send200(res) {
    res.status(200).json({
        status: 200,
        message: "succesful!"
    });
}
module.exports=send200;