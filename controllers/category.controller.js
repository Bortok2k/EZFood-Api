const service = require('../services/category.service');
const {verifyToken}= require('../helpers/jwt');

const createController = async (req , res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else if(auth.decoded.rol != 1){
            return res.status(401).json({
                msg: 'unauthorized'
            });
        } else {
            await service.createService(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const getController = async (req , res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else if(auth.decoded.rol != 1){
            return res.status(401).json({
                msg: 'unauthorized'
            });
        } else {
            await service.getService(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const updateController = async (req , res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else if(auth.decoded.rol != 1){
            return res.status(401).json({
                msg: 'unauthorized'
            });
        } else {
            await service.updateService(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const deleteController = async (req , res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else if(auth.decoded.rol != 1){
            return res.status(401).json({
                msg: 'unauthorized'
            });
        } else {
            await service.deleteService(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }   
}

module.exports = {
    createController,
    deleteController,
    updateController,
    getController,
}