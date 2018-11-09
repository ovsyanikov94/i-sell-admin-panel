"use strict";

const Category = require('../model/definitions').Category;
const Lot = require('../model/definitions').Lot;

module.exports.AddCategory = async( req , res )=>{

    try{

        let title = req.body.categoryTitle;

        let newCategory = new Category({
            title: title
        });

        let result = await newCategory.save();

    }//try
    catch(ex){

    }//catch

};
