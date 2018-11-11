"use strict";

const Category = require('../model/Category');
const Lot = require('../model/Lot');

function GetClearMessage( validationError ){

    console.log( validationError );

    let errors = Object.keys(validationError);

    let result = [];

    for(let i = 0 ; errors.length ; i++){

        let key = errors[i];

        result.push( validationError[key].message );

    }//for i

    return result;

}//GetClearMessage

module.exports = {
    AddCategory: async (req, res) => {

        try {

            let title = req.body.categoryTitle;

            //console.log( title );

            let newCategory = new Category({
                title: title
            });

            let result = await newCategory.save();

            //console.log( newCategory );

            res.send({
                'category': result
            });

        }//try
        catch (ex) {

            res.send(ex.message);

        }//catch

    },

    categoriesList: async (req, res) => {

    //console.log('LIST!');

    try {

        let categories = await Category.find().populate('lots', {
            select: [
                'id',
                'lotTitle'
            ]
        });


        //console.log('categories' , categories);

        res.send({
            statusCode: 200,
            data: categories,
            message: 'Success!'
        });

    }//try
    catch (ex) {

        console.log(ex);

    }//catch


},//categoriesList

    updateCategory: async ( req , res )=>{

        try{

            let categoryID = req.params.id;

            if(!await Category.findOne({id: categoryID})){
                return res.send({
                    code:400,
                    message:'Категория с таким ID не найдена!',
                    data:categoryID
                });
            }//if

            let categoryTitle = req.body.categoryTitle;

            if(categoryTitle.trim().length === 0){
                return res.send({
                    code:400,
                    message:'некорректные данные',
                    data:categoryTitle
                });
            }//if

            let category = await Category.findOne({categoryTitle: newCategoryTitle});

            if(category){
                return res.send({
                    code:400,
                    message:'категория с таким названием уже существует!',
                    data:category
                });
            }//if


            let updatedCategory = await Category.update({id: categoryID} , {categoryTitle:categoryTitle}).fetch();

            res.send(updatedCategory);

        }//try
        catch(ex){

            res.send(ex);

        }//catch

    },//updatedCategory

    deleteCategory: async ( req , res )=>{

        try{

            let categoryID = req.params.id;

            if(!await Category.findById({categoryID})){
                return res.send({
                    code:400,
                    message:'Категория с таким ID не найдена!',
                    data:categoryID
                });
            }//if

            let deletedCategory = await Category.remove({id: categoryID});
            console.log( deletedCategory );
            res.send({
                code:200,
                message:'Категория удалена!',
                data:deletedCategory
            });

        }//try
        catch(ex){

            res.send(ex);

        }//catch

    },//deleteCategory

};
