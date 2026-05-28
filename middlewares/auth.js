const {verifyToken} = require('../helpers/jwt');

const tokenAuthentication = (req, res) => {
    const {authorization} = req.headers;
    const auth = verifyToken(authorization);

    if(!auth.status){
        return res.status(auth.statusCode).json({
            msg: auth.msg
        });
    }
}

module.exports = {
    tokenAuthentication
}