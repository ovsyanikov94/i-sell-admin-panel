"use strict";

const Category = require('../model/Category');
const Lot = require('../model/Lot');

const Logger = require('../model/Logger');
const ValidatorConstants = require('../model/Validation');
const Response = require('../model/Response');

module.exports = {

    AddCategory: async (req, res) => {

        try {

            let title = req.body.categoryTitle || '';

            if( !title.match( ValidatorConstants.TITLE_VALIDATOR ) ){

                Response.status = 400;
                Response.message = 'Название категории не верно!';
                Response.data = title;

                res.status(Response.status);
                res.send(Response);

                return;
            }//if

            let newCategory = new Category({
                title: title
            });

            let result = await newCategory.save();

            Response.status = 200;
            Response.message = 'Категория добавлена!';
            Response.data = result;

        }//try
        catch (ex) {

            Response.status = 500;
            Response.message = 'Внутренняя ошибка сервера!';
            Response.data = ex.message;

            Logger.error({
                time: new Date().toISOString(),
                status: 500,
                data: {
                    message: ex.message,
                    stack: ex.stack
                },
            });

        }//catch

        res.status(Response.status);
        res.send(Response);

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

            let categoryID = req.params.id || '';

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
