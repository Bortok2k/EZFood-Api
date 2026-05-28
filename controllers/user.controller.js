const userServices = require('../services/user.service');
const firebase = require('../database/connection');
const firestore = firebase.firestore();
const {verifyToken}= require('../helpers/jwt');

const createUser = async (req, res) => {
    try{
        const data = req.body;
        const userDoc = await firestore.collection('user').where('user_name', '==', data.user_name).get();
        const userSnapshot = [];
        userDoc.docs.forEach(doc => {
            userSnapshot.push(doc);
        });
        if(userSnapshot.length != 0){
            if(userSnapshot[0].exists){
                return res.status(404).json({
                    msg: 'user [' + user_name + '] already exists' 
                });
            } 
        }
        await userServices.createService(data, res); 
    }catch(e){
        return res.status(400).json({
            msg: 'bad request'
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
        } else if(auth.decoded.rol != 1){
            return res.status(401).json({
                msg: 'unauthorized'
            });
        } else {
            await userServices.getAllService(res);
        }
    }catch(e){
        return res.status(401).json({
            msg: 'unauthorized'
        });
    }
}

const getById = async (req, res) => {
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
            await userServices.getByIdService(req, res);
        }
    }catch(e){
        return res.status(401).json({
            msg: 'unauthorized'
        });
    }   
}

const updateUser = async (req, res) => {
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
            await userServices.updateService(req, res);
        }
    }catch(e){
        return res.status(401).json({
            msg: 'unauthorized'
        });
    }
}

const deleteUser = async (req, res) =>{
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
            await userServices.deleteUserService(req, res);
        }
    }catch(e){
        return res.status(401).json({
            msg: 'unauthorized'
        });
    }
}

module.exports = {
    createUser,
    getAll,
    getById,
    updateUser,
    deleteUser
}