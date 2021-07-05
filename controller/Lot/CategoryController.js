"use strict";

const Category = require('../../model/Category');
const Lot = require('../../model/Lot');

const Logger = require('../../model/Logger');
const ValidatorConstants = require('../../model/Validation');
const Response = require('../../model/Response');

module.exports = {

    AddCategory: async (req, res) => {

        console.log(req.body);
        try {

            //let title = 'телефоны';
            let title = req.body.categoryTitle || '';

            let existTitle = await Category.findOne({title: title})


            if( !title.match( ValidatorConstants.TITLE_VALIDATOR ) ){

                Response.status = 400;
                Response.message = 'Название категории не верно!';
                Response.data = title;

                res.status(Response.status);
                res.send(Response);

                return;
            }//if

            if (existTitle){
                Response.status = 400;
                Response.message = 'Категория с таким названием уже существует!';
                Response.data = title;

                res.status(Response.status);
                res.send(Response);

                return;
            }

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

        let limit = +req.query.limit || 5;
        let offset = +req.query.offset || 0;

        let categories = await Category.find( null , 'id title' , {
            limit: limit,
            skip: offset
        });

        //console.log('categories' , categories);

        Response.status = 200;
        Response.message = 'Success!';
        Response.data = categories;

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


},//categoriesList

    updateCategory: async ( req , res )=>{

        try{

            let categoryID = req.body.id || '';

            let categoryByID = await Category.findById(categoryID);

            if(!categoryByID){
                Response.status = 400;
                Response.message = 'Категория с таким ID не найдена!';
                Response.data = categoryID;

                res.status(Response.status);
                res.send(Response);

                return;

            }//if



            let categoryTitle = req.body.categoryTitle || "";

            if( !categoryTitle.match( ValidatorConstants.TITLE_VALIDATOR ) ){

                Response.status = 400;
                Response.message = 'Название категории не верно!';
                Response.data = categoryTitle;

                res.status(Response.status);
                res.send(Response);

                return;
            }//if

            let existTitle = await Category.findOne({title: categoryTitle});

            if (existTitle){
                Response.status = 400;
                Response.message = 'Категория с таким названием уже существует!';
                Response.data = title;

                res.status(Response.status);
                res.send(Response);

                return;
            }


            let updatedCategory = await Category.updateOne({id: categoryID} , {categoryTitle:categoryTitle});

            Response.status = 200;
            Response.message = 'Категория добавлена!';
            Response.data = updatedCategory;

        }//try
        catch(ex){

            res.send(ex);

        }//catch

        res.status(Response.status);
        res.send(Response);

    },//updatedCategory

    deleteCategory: async ( req , res )=>{

        try{
            let categoryID = req.params.id;
            //let categoryID = req.body.id;

            let category = await Category.findById(categoryID);

            //console.log('categoryID', categoryID);
            //console.log('BODY: ' , req.body);
            //console.log('category: ' , category);
            if(!category){
                Response.status = 400;
                Response.message = 'Категория с таким ID не найдена!';
                Response.data = categoryID;

                res.status(Response.status);
                res.send(Response);

                return;

            }//if

            //let deletedCategory = await Category.deleteOne({id: categoryID});
            let deletedCategory = await category.delete();

            console.log('deletedCategory: ' , deletedCategory);

            Response.status = 200;
            Response.message = 'Категория удалена!';
            Response.data = deletedCategory;

        }//try
        catch(ex){

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


    },//deleteCategory

};
