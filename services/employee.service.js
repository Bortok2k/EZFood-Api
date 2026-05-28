const firebase = require('../database/connection');
const firestore = firebase.firestore();
const bcrypt = require('bcrypt');

const createService = async (req, res) => {
    try{
        const data = req.body;
    
        const {first_name, last_name, mail, phone, second_name} = data;
        const {id_doc, salary} = data;
        const {user_name} = data;
        let {password} = data;
    
        const rol = 2;
        const active = 1;
    
        const userDoc = await firestore.collection('user').where('user_name', '==', data.user_name).get();
        const userSnapshot = [];
    
        userDoc.docs.forEach(doc => {
            userSnapshot.push(doc);
        });
    
        const employeeDoc = await firestore.collection('employee').where('id_doc', '==', id_doc).get();
        const employeeSnapshot = [];
    
        employeeDoc.docs.forEach(doc => {
            employeeSnapshot.push(doc);
        });
    
        if(userSnapshot.length != 0){
            if(userSnapshot[0].exists){
                return res.status(404).json({
                    msg: 'user [' + data.user_name + '] already exists' 
                });
            }
        }
    
        if(employeeSnapshot.length != 0){
            if(employeeSnapshot[0].exists){
                return res.status(400).json({
                    msg: 'employ with document #: ' + id_doc + ' already exists' 
                });
            }
        }
    
        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync(password, salt);
    
        const user = await firestore.collection('user').add({
            password, 
            rol, 
            user_name
        });
        
        const user_id = user.id;
        const userData = await firestore.collection('user_data').add({
            first_name, 
            last_name, 
            mail, phone, 
            second_name,
            user_id
        });
        
        const employeeData = await firestore.collection('employee').add({
            active,
            id_doc,
            salary,
            user_id
        })
    
        return res.status(200).json({
            msg: 'register successfuly'    
        });  
    }catch(e){
        res.status(400).json({
            msg: 'register error',
            error: e
        });
    }
}

const getAllService = async (req, res) => {
    try{
        const userDocs = await firestore.collection('user').where('rol','==',2).get();
        const userMap = new Map(userDocs.docs.map(doc => [doc.id, doc.data()]));

        const userDataDocs = await firestore.collection('user_data').get();
        const userDataMap = new Map(userDataDocs.docs.map(doc => [doc.data().user_id, doc.data()]));

        const employeeDocs = await firestore.collection('employee').where('active','==',1).get();
        const employeeMap = new Map(employeeDocs.docs.map(doc => [doc.data().user_id, doc.data()]));

        const userList = [];
        if(userDocs.empty || userDataDocs.empty || employeeDocs.empty){
            res.status(404).json({
                msg: 'no data'
            });
        }else{
            userDocs.forEach(userDoc => {
                const user_id = userDoc.id;
    
                const userData = userDataMap.get(user_id) || {};
                const employeeData = employeeMap.get(user_id) || {};

                delete userData.user_id;
                delete employeeData.user_id;
    
                const user = {
                    user_id: userDoc.id,
                    user_name: userDoc.data().user_name,
                    rol: userDoc.data().rol,
                    user_data: userData,
                    employee_data: employeeData
                };
    
                userList.push(user);
            });   
            res.status(200).json({
                msg: 'OK',
                data_list: userList
            });
        }
    }catch(e){
        res.status(400).json({
            msg: 'bad request',
            error: e
        });
    }
}

const getByIdDocService = async (req, res) => {
    try{
        const id = req.params.id;

        const employeeDocs = await firestore.collection('employee').where('id_doc', '==', id).get();
        const employeeSnapshot = [];

        employeeDocs.forEach(doc =>{
            employeeSnapshot.push(doc);
        });

        if(employeeSnapshot.length == 0){
            res.status(404).json({
                msg: 'no data'
            });
        } else if(employeeSnapshot[0].data().active == 0){
            res.status(400).json({
                msg: 'employee has been fired.'
            });
        } 
        else {
            const userId = employeeSnapshot[0].data().user_id;
            const userDocs = await firestore.collection('user').doc(userId);
            const userSnapshot = await userDocs.get();
    
            const userDataDocs = await firestore.collection('user_data').where('user_id', '==', userId).get();
            const userDataSnapshot = [];
    
            userDataDocs.forEach(doc => {
                userDataSnapshot.push(doc);
            }); 
            const data = {
                msg: 'OK',
                data: {
                    user_id: userSnapshot.id,
                    user_name: userSnapshot.data().user_name,
                    user_data: userDataSnapshot[0].data(),
                    employee_data: employeeSnapshot[0].data()
                }
            };
            res.status(200).json({
                msg: 'OK',
                data: {
                    user_id: userSnapshot.id,
                    user_name: userSnapshot.data().user_name,
                    user_data: userDataSnapshot[0].data(),
                    employee_data: employeeSnapshot[0].data()
                }
            });
        }        
    }catch(e){
        res.status(400).json({
            msg: 'bad request',
            error: e
        });
    }
}

const fireEmployeeService = async (req, res) => {
    try{
        const id = req.params.id;

        const employeeDocs = await firestore.collection('employee').where('id_doc', '==', id).get();
        const employeeSnapshot = [];

        employeeDocs.forEach(doc =>{
            employeeSnapshot.push(doc);
        });

        if(employeeSnapshot.length == 0){
            return res.status(404).json({
                msg: 'employee does not exists'
            });
        } else if(employeeSnapshot[0].data().active == 0){
            return res.status(400).json({
                msg: 'employee has already been fired'
            });
        }else{
            await employeeSnapshot[0].ref.update({
                active: 0
            });
            res.status(200).json({
                msg: 'employee with id: '+ id + ' successfully dismissed',
            });
        }
    }catch(e){
        res.status(400).json({
            msg: 'bad request',
            error: e
        });
    }
}

const updateService = async (req, res) => {
    try{
        const id = req.params.id;
        const data = req.body;

        const employeeDocs = await firestore.collection('employee').where('id_doc', '==', id).get();
        const employeeSnapshot = [];

        employeeDocs.forEach(doc =>{
            employeeSnapshot.push(doc);
        });

        if(employeeSnapshot.length == 0){
            return res.status(404).json({
                msg: 'employee does not exists'
            });
        } else if(employeeSnapshot[0].data().active == 0){
            return res.status(400).json({
                msg: 'employee has been fired'
            });
        }else{
            await employeeSnapshot[0].ref.update(data);
            res.status(200).json({
                msg: 'employee with id: '+ id + ' successfully updated',
            });
        }
    }catch(e){
        res.status(400).json({
            msg: 'bad request',
            error: e
        });
    }
}

module.exports = {
    createService,
    getAllService,
    getByIdDocService,
    fireEmployeeService,
    updateService
}