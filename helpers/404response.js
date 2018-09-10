function send404(res) {
    res.status(404).json({
        status: 404,
        message: "the resource you are looking for does not exist"
    });
}

module.exports=send404;