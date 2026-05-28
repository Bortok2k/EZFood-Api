const {verifyToken}= require('../helpers/jwt');
const services = require('../services/employee.service');

const createEmployee = async (req, res) => {
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

const getAll = async (req, res, next) => {
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
        }
        await services.getAllService(req, res); 
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const getByIdDoc = async (req, res) => { 
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
        }
        await services.getByIdDocService(req, res);
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const fireEmployee = async (req, res) => {
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
        }
        await services.fireEmployeeService(req, res);
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

const updateEmployee = async (req, res) => {
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
        }
        await services.updateService(req, res);
    }catch(e){
        res.status(401).json({
            msg: 'unauthorized',
            error: e
        });
    }
}

module.exports = {
    createEmployee,
    getAll,
    getByIdDoc,
    fireEmployee,
    updateEmployee
}