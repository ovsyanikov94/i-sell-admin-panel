/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  categoriesList: async ( req , res )=>{

    console.log('LIST!');

    try{

      let categories = await Category.find().populate('lots' , {
        select: [
          'id',
          'lotTitle'
        ]
      });

      console.log('categories' , categories);

      res.MainResponse( {
        statusCode: 200,
        data: categories,
        message: 'Success!'
      });

    }//try
    catch(ex){

      console.log(ex);

    }//catch


  },//categoriesList

  createCategory: async( req , res )=>{

    try{

        let newCategoryTitle = req.body.categoryTitle;

        let newCategory = await Category.create({
          "categoryTitle": newCategoryTitle
        }).fetch();

        res.send(newCategory);

    }//try
    catch(ex){

      res.send(ex);

    }//catch

  },//createCategory

};

