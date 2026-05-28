const {verifyToken}= require('../helpers/jwt');
const services = require('../services/address.service');

const createAdress = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.createService(req, res, auth.decoded.user_name);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const updateAdress = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.updateService(req, res, auth.decoded.user_name);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const getAddressByUser = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.getByUserService(req, res, auth.decoded.user_name);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const deleteAdress = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.deleteAddressService(req, res, auth.decoded.user_name);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

module.exports = {
    createAdress,
    updateAdress,
    getAddressByUser,
    deleteAdress
}