const jwt = require('jsonwebtoken');

//verify token middleware
function  verifyToken(req, res, next) {
    //get request headers
    console.log(req.headers);
    const requestHeader = req.body.Authorization || req.headers['authorization'];
    console.log(req.headers);
    console.log(req.body);
    //check if header has the request token
    if(requestHeader !== undefined){
        
        //get  the token
        req.token = requestHeader;
        console.log(req.token);
        jwt.verify(req.token, 'secret_key', (err, user)=>{
            if(err){
                console.log('token verification failed');
                //console.log(err);
                res.status(403).json({
                    status:403,
                    msg:"forbidden, you do not have authorization to access this url"
                });
            }else {
                console.log('token verified, access granted');
                next();
            }
        });

    }else {
        console.log('request token missing');
        //restrict access if token is absent
        res.status(403).send('you are not allowed to access this url');
    }
}

module.exports = verifyToken;