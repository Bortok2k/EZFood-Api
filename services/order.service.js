const firebase = require('../database/connection');
const firestore = firebase.firestore();

const createService = async (req, res, user) => {
    const data = req.body;

  try {
    const userQuery = await firestore.collection('user').where('user_name', '==', user).get();
    const user_id = userQuery.docs[0].id;
    const nowDate = new Date();

    const orderCreate = await firestore.collection('order').add({
        address_name: data.address_name,
        lat: data.lat,
        lng: data.lng,
        owner: user,
        owner_id: user_id,
        date: data.date,
        observations: data.observations,       
        total_price: data.total_price,
        state: false,
        taken: false,
        delivery_id: "",
        canceled: false
    });

    const order_id = orderCreate.id;
    var idlist =[];
    await data.items.forEach(async (e) => {
        var orderItemQuery = await firestore.collection('order').doc(orderCreate.id).collection('items').add({
        item_desc: e.item_desc,
        item_id: e.item_id,
        quantity: e.quantity,
        unit_price: e.unit_price
        }   
      );
      const item_id = orderItemQuery.id;
      idlist.push(item_id);
    });

    const orderQuery = await firestore.collection('order').doc(order_id).get();
    const orderItemsQuery = await firestore.collection('order').doc(order_id).collection('items').get();
    orderItemSnapshot = [];
    itemList = [];

    orderItemsQuery.forEach(doc => {
      orderItemSnapshot.push(doc);
    });

    orderItemSnapshot.forEach((e) => {
      itemList.push({
        id: e.id,
        item_desc: e.data().item_desc,
        item_id: e.data().item_id,
        quantity: e.data().quantity,
        unit_price: e.data().unit_price
      });
    });

    res.status(200).json({
      id: order_id,
      address_name: orderQuery.data().address_name,
      lat: orderQuery.data().lat,
      lng: orderQuery.data().lng,
      owner: orderQuery.data().owner,
      owner_id: orderQuery.data().owner_id,
      total_price: orderQuery.data().total_price,
      observations: orderQuery.data().observations,
      date: orderQuery.data().date,
      state: orderQuery.data().state,
      taken: orderQuery.data().taken,
      delivery_id: orderQuery.data().delivery_id,
      canceled: orderQuery.data().canceled,
      items: itemList
    });
  } catch (error) {
    console.error('Error al crear o añadir dirección:', error);
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const takeService = async (req, res, user) => {
  const order_id = req.params.id;

  try {
    const userQuery = await firestore.collection('user').where('user_name', '==', user).get();
    const user_id = userQuery.docs[0].id;
    const updateQuery = await firestore.collection('order').doc(order_id).update({
        taken: true,
        delivery_id: user_id
    });

    res.status(200).json({
      msg: "Orden tomada"
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const cancelService = async (req, res) => {
  const order_id = req.params.id;
  
    try {
      const order_query = await await firestore.collection('order').doc(order_id);
      const orderSnapshot = [];
      orderQuery.forEach(doc =>{
        orderSnapshot.push(doc);
      });
      var doc = orderSnapshot[0];
      if(doc.data.taken){
        res.status(400).json({
          msg: "La orden ya fue tomada"
        });
      }else{
        const updateQuery = await firestore.collection('order').doc(order_id).update({
          canceled: true
        });
        res.status(200).json({
          msg: "Orden cancelada"
        });
      }
      
    } catch (error) {
      res.status(500).json({
        msg: "Internal server error"
      });
    }
}

const shippedService = async (req, res) => {
  const order_id = req.params.id;
    try {
      const updateQuery = await firestore.collection('order').doc(order_id).update({
          state: true
      });
  
      res.status(200).json({
        msg: "Order shipped successfuly"
      });
    } catch (error) {
      res.status(500).json({
        msg: "Internal server error"
      });
    }
}

const getByUserService = async (req, res, user) => {
  try{
    const orderQuery = await firestore.collection('order').where('owner', '==', user).where('state','==',false).get();

    const orderSnapshot = [];

    orderQuery.forEach(doc =>{
      orderSnapshot.push(doc);
    });

    const orderRes = orderSnapshot.map(doc => {
      const data = doc.data;
      return{
        id: doc.id,
        address_name: doc.data().address_name,
        lat: doc.data().lat,
        lng: doc.data().lng,
        owner: doc.data().owner,
        owner_id: doc.data().owner_id,
        total_price: doc.data().total_price,
        observations: doc.data().observations,
        date: doc.data().date,
        state: doc.data().state,
        taken: doc.data().taken,
        delivery_id: doc.data().delivery_id,
        canceled: doc.data().canceled,
    };
    });

    res.status(200).json({
        orders: orderRes,
      }
    );
  }catch(e){
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const getService = async (req, res) => {
  try{
    const orderQuery = await firestore.collection('order').where('state', '==', false).get();

    const orderSnapshot = [];

    orderQuery.forEach(doc =>{
      orderSnapshot.push(doc);
    });

    const orderRes = orderSnapshot.map(doc => {
      const data = doc.data;
      return{
        id: doc.id,
        address_name: doc.data().address_name,
        lat: doc.data().lat,
        lng: doc.data().lng,
        owner: doc.data().owner,
        owner_id: doc.data().owner_id,
        total_price: doc.data().total_price,
        observations: doc.data().observations,
        date: doc.data().date,
        state: doc.data().state,
        taken: doc.data().taken,
        delivery_id: doc.data().delivery_id,
        canceled: doc.data().canceled,
    };
    });

    res.status(200).json({
        orders: orderRes,
      }
    );
  }catch(e){
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const updateOrderItem = async (req, res) => {
  try{
    const data = req.body;
    const order_id = req.params.orderId;
    const item_id = req.params.itemId;

    const orderItemQuery = await firestore.collection('order').doc(order_id).collection('items').doc(item_id).update(
      {
        quantity: data.quantity,
        observations: data.observations,
      }
    );
    res.status(200).json({
      msg: "Order item updated succesfully"
    });
  }catch (e){
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const deleteOrderItem = async (req, res) => {
  try{
    const order_id = req.params.orderId;
    const item_id = req.params.itemId;
    
    const deleteQuery = await firestore.collection('order').doc(order_id).collection('items').doc(item_id).delete();

    res.status(200).json({
      msg: "Order item deleted succesfully"
    });
  }catch (e){
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const addOrderItem = async (req, res) => {
  try{
    const order_id = req.params.id;
    const data = req.body;

    const orderQuery = await firestore.collection('order').doc(order_id).collection('items').add(data);

    const orderItemQuery = await firestore.collection('order').doc(order_id).collection('items').doc(orderQuery.id).get();

    res.status(200).json({
      id: orderItemQuery.id,
      item_desc: orderItemQuery.data().item_desc,
      item_id: orderItemQuery.data().item_id,
      quantity: orderItemQuery.data().quantity,
      unit_price: orderItemQuery.data().unit_price
    });
  }catch (e){
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const getItemsByOrder = async (req, res) => {
  try{
    const order_id = req.params.id;
    const orderItemsQuery = await firestore.collection('order').doc(order_id).collection('items').get();
    orderItemSnapshot = [];
    itemList = [];

    orderItemsQuery.forEach(doc => {
      orderItemSnapshot.push(doc);
    });

    orderItemSnapshot.forEach((e) => {
      itemList.push({
        id: e.id,
        item_desc: e.data().item_desc,
        item_id: e.data().item_id,
        quantity: e.data().quantity,
        unit_price: e.data().unit_price
      });
    });

    res.status(200).json(itemList);
  }catch (e){
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

module.exports = {
    createService,
    takeService,
    cancelService,
    shippedService,
    getService,
    updateOrderItem,
    deleteOrderItem,
    addOrderItem,
    getItemsByOrder,
    getByUserService
}