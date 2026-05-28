const {verifyToken}= require('../helpers/jwt');
const services = require('../services/order.service');

const createOrder = async (req, res) => {
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

const GetOrdersByUser = async (req, res) => {
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

const takeOrder = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else if(auth.decoded.rol != 2 && auth.decoded.rol != 1){
            return res.status(401).json({
                msg: 'unauthorized'
            });
        } else {
            await services.takeService(req, res, auth.decoded.user_name);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const cancelOrder = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.cancelService(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const shippedOrder = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else if(auth.decoded.rol != 2 && auth.decoded.rol !=1){
            return res.status(401).json({
                msg: 'unauthorized'
            });
        } else {
            await services.shippedService(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const getAll = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else if(auth.decoded.rol != 2 && auth.decoded.rol != 1){
            return res.status(401).json({
                msg: 'unauthorized'
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

const updateOrderItem = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.updateOrderItem(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const deleteOrderItem = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.deleteOrderItem(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const addOrderItem = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.addOrderItem(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const getItemsByOrder = async (req, res) => {
    try{
        const {authorization} = req.headers;
        const auth = verifyToken(authorization);

        if(!auth.status){
            return res.status(auth.statusCode).json({
                msg: auth.msg
            });
        } else {
            await services.getItemsByOrder(req, res);
        }
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
  }

module.exports = {
    createOrder,
    takeOrder,
    cancelOrder,
    shippedOrder,
    getAll,
    updateOrderItem,
    deleteOrderItem,
    addOrderItem,
    getItemsByOrder,
    GetOrdersByUser,
}