const firebase = require('../database/connection');
const firestore = firebase.firestore();

const createService = async (req, res) => {
    const data = req.body;
    try{
        const {
            category_id, 
            description, 
            dish_name, 
            label_img, 
            price
        } = data;

        const connection = await firestore.collection('menu').add({
            category_id: category_id,
            description: description,
            dish_name: dish_name,
            label_img: label_img,
            price: price,
        });
        res.status(200).json({
            msg: 'menu item added successfully'    
        });
    }catch(e){
        res.status(500).json({
            msg: "Internal server error"
        });
    }
}

const getService = async (req, res) => {
    try{
        const dishes = await firestore.collection('menu');
        const data =  await dishes.get();
        const dishesList = [];
        if(data.empty){
            res.status(404).json({
                msg: 'no data'
            });
        }else{
            data.docs.forEach(doc => {
                    const dish = {
                        dish_id: doc.id,
                        category_id: doc.data().category_id,
                        description: doc.data().description,
                        dish_name: doc.data().dish_name,
                        label_img: doc.data().label_img,
                        price: doc.data().price
                    }
                    dishesList.push(dish);
                }
            );
            res.status(200).json({
                msg: 'OK',
                data: dishesList
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
    const addressQuery = await firestore.collection('menu').doc(item_id).update(data);

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
      const addressQuery = await firestore.collection('menu').doc(item_id).delete();
  
      res.status(200).json({
        msg: "item deleted successfuly"
      });
    } catch (error) {
      res.status(500).json({
        msg: "Internal server error"
      });
    }
  }

const getMenuWithCategories = async (req, res) => {
  try{
    const categories = await firestore.collection('menu_categories').get();
    var resList =[];
    if(categories.empty){
      res.status(404).json({
        msg: 'no data'
      });
    }else{
      const categoryDocs = await firestore.collection('menu_categories').get();
      const categoryMap = new Map(categoryDocs.docs.map(doc => [doc.id, doc.data()]));

      const menuDocs = await firestore.collection('menu').get();
      var menuMap = [];
      menuDocs.docs.forEach(doc => {
        menuMap.push({
          dish_id: doc.id,
          category_id: doc.data().category_id,
          description: doc.data().description,
          dish_name: doc.data().dish_name,
          label_img: doc.data().label_img,
          price: doc.data().price
        });
      })

      const resList = [];
      if(categoryDocs.empty || menuDocs.empty){
          res.status(404).json({
              msg: 'no data'
          });
      }else{
        categoryDocs.forEach(doc => {
          const category_id = doc.id;
          var dishList =[];
    
          menuMap.forEach(e => {
            if(e['category_id'] == category_id){
              delete e.category_id;
              dishList.push(e);
            }
          });

          const category = {
              category_id: category_id,
              category_name: doc.data().category_name,
              dishes: dishList,
          };
          if(dishList.length > 0){
            resList.push(category);
          }
        });   
        res.status(200).json({
          msg: 'OK',
          data: resList
        });
      }
    }
  }catch (error){
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
    getMenuWithCategories,
}