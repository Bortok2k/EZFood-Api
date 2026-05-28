const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async(usuario) =>{
    const {user_name, rol} = usuario;
    return jwt.sign(
        {
            user_name: user_name,
            rol: rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "6h"
        }
    );
}

const verifyToken = (authorization) => { 
    try{
        const token = authorization.split(' ')[1];
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            decoded: decoded,
            status: true,
            statusCode: 200
        }
    }catch(e){
        return {
            msg: 'invalid token',
            error: e,
            status: false,
            statusCode: 403
        };
    }
}

module.exports = {
    generateToken,
    verifyToken
}