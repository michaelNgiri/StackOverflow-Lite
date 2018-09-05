//
// const jwt = require('jsonwebtoken');
//
// //verify token middleware
// function  verifyToken(req, res, next) {
//     //get request headers
//     const requestHeader = req.headers['authorization'];
//     console.log('this is the token below:');
//     console.log(requestHeader);
//     //check if header has the request token
//     if(requestHeader !== undefined){
//         //grant access to user
//         const  bearer = requestHeader.split(' ');
//         //get  the token
//         const requestToken = bearer[1];
//         req.token = requestToken;
//
//         jwt.verify(req.token, 'secret_key', (err, user)=>{
//             if(err){
//                 console.log(err);
//                 res.status(403).json({
//                     status:403,
//                     msg:"forbidden, you do not have authorization to access this url"
//                 });
//             }else {
//                 next();
//             }
//         });
//
//     }else {
//         //restrict access if token is absent
//         res.status(403).send('you are not allowed to access this url');
//     }
// }
// verifyToken();
//
