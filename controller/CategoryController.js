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

module.exports.AddCategory = async( req , res )=>{

    try{

        let title = req.body.categoryTitle;

        let newCategory = new Category({
            title: title
        });

        let result = await newCategory.save();

        res.send( {
            'category': result
        } );

    }//try
    catch(ex){

        res.send( ex.message );

    }//catch

};
