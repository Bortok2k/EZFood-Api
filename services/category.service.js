const firebase = require('../database/connection');
const firestore = firebase.firestore();

const createService = async (req, res) => {
    const data = req.body;
    try{
        const {
            category_name, 
        } = data;

        const connection = await firestore.collection('menu_categories').add({
            category_name: category_name,
        });
        res.status(200).json({
            msg: 'menu category added successfully'    
        });
    }catch(e){
        res.status(500).json({
            msg: "Internal server error"
        });
    }
}

const getService = async (req, res) => {
    try{
        const categories = await firestore.collection('menu_categories');
        const data =  await categories.get();
        const categoriesList = [];
        if(data.empty){
            res.status(404).json({
                msg: 'no data'
            });
        }else{
            data.docs.forEach(doc => {
                    const category = {
                        category_id: doc.id,
                        category_name: doc.data().category_name,
                    }
                    categoriesList.push(category);
                }
            );
            res.status(200).json({
                msg: 'OK',
                data: categoriesList
            });
        }
    }catch (e){
        res.status(500).json({
            msg: "Internal server error"
        });
    }
}

const updateService = async (req, res) => {
  const data = req.body;
  const item_id = req.params.id;

  try {
    const addressQuery = await firestore.collection('menu_categories').doc(item_id).update(data);

    res.status(200).json({
      msg: "item updated successfuly"
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error"
    });
  }
}

const deleteService = async (req, res) => {
    const item_id = req.params.id;
    try {
      const addressQuery = await firestore.collection('menu_categories').doc(item_id).delete();
  
      res.status(200).json({
        msg: "item deleted successfuly"
      });
    } catch (error) {
      res.status(500).json({
        msg: "Internal server error"
      });
    }
  }

module.exports = {
    createService,
    getService,
    updateService,
    deleteService,
}