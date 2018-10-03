const jwt = require('jsonwebtoken');

//token verification middleware 
//checks if the client has the request token which would prove that the client is logged in
//in case the request token is missing or wrong, the user will be denied access and 401 helper is called
function  verifyToken(req, res, next) {
    //get request headers
    const requestHeader = req.body.Authorization || req.headers['authorization'];
    //check if header has the request token
    if(requestHeader !== undefined){
        
        //get  the token
        req.token = requestHeader;
        jwt.verify(req.token, 'secret_key', (err, user)=>{
            if(err){
                console.log(err);
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
        //restrict access if token is absent
        res.status(403).send('you are not allowed to access this url');
    }
}

module.exports = verifyToken;