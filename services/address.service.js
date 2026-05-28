const firebase = require('../database/connection');
const firestore = firebase.firestore();

const createService = async (req, res, user) => {
    const data = req.body;

  try {
    const userQuery = await firestore.collection('user').where('user_name', '==', user).get();
    const user_id = userQuery.docs[0].id;

    const addressQuery = await firestore.collection('address').where('user_id', '==', user_id).get();

    if (addressQuery.empty) {
      const newAddressDoc = await firestore.collection('address').add({
        user: user,
        user_id: user_id
      });

      await firestore.collection('address').doc(newAddressDoc.id).collection('addresses').add({
        lat: data.lat,
        lng: data.lng,
        address_name: data.adress_name,
      });

      res.status(200).json({
        msg: "Address created successfuly"
      });
    } else {
      await firestore.collection('address').doc(addressQuery.docs[0].id).collection('addresses').add({
        lat: data.lat,
        lng: data.lng,
        address_name: data.adress_name,
      });
      
      res.status(200).json({
        msg: "Address added successfuly"
      });
    }
  } catch (error) {
    console.error('Error al crear o añadir dirección:', error);
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const updateService = async (req, res, user) => {
  const data = req.body;
  const adress_id = req.params.id;

  try {
    const userQuery = await firestore.collection('user').where('user_name', '==', user).get();
    const user_id = userQuery.docs[0].id;

    const addressQuery = await firestore.collection('address').where('user_id', '==', user_id).get();
    const addressId = addressQuery.docs[0].id;

    await firestore.collection('address').doc(addressId).collection('addresses').doc(adress_id).update({
      lat: data.lat,
      lng: data.lng,
      address_name: data.adress_name,
    });

    res.status(200).json({
      msg: "Address updated successfuly"
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const getByUserService = async (req, res, user_name) => {
  try{
    const userQuery = await firestore.collection('user').where('user_name', '==', user_name).get();
    const user_id = userQuery.docs[0].id;

    const addressQuery = await firestore.collection('address').where('user_id', '==', user_id).get();
    const addressId = addressQuery.docs[0].id;

    const adresses = await firestore.collection('address').doc(addressId).collection('addresses').get();

    const adressesSnapshot = [];

    adresses.forEach(doc =>{
      adressesSnapshot.push(doc);
    });

    const adressesRes = adressesSnapshot.map(e => {
      return{
      id : e.id,
      lat : e.data().lat,
      lng : e.data().lng,
      address_name : e.data().address_name
    };
    });

    res.status(200).json({
        user: addressQuery.docs[0].data().user,
        adresses: adressesRes,
      }
    );
  }catch(e){
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const deleteAddressService = async (req, res, user_name) => {
  const delete_id = req.params.id;
  try{
    const userQuery = await firestore.collection('user').where('user_name', '==', user_name).get();
    const user_id = userQuery.docs[0].id;

    const addressQuery = await firestore.collection('address').where('user_id', '==', user_id).get();
    const addressId = addressQuery.docs[0].id;

    const adresses = await firestore.collection('address').doc(addressId).collection('addresses').doc(delete_id).delete();

    res.status(200).json({
      msg: "address " + delete_id + " was deleted successfully",
    });
  }catch(e){
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

module.exports = {
    createService,
    updateService,
    getByUserService,
    deleteAddressService,
}