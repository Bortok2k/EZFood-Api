const {verifyToken}= require('../helpers/jwt');
const services = require('../services/menu.service');

const createDish = async (req, res)=>{
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
            await services.createService(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const getDish = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.getService(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const updateDish = async (req, res)=>{
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
            await services.updateService(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const deleteDish = async (req, res)=>{
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
            await services.deleteService(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const getMenuWithCategory = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.getMenuWithCategories(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

module.exports = {
    createDish,
    getDish,
    updateDish,
    deleteDish,
    getMenuWithCategory,
}