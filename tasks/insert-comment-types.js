"use strict";

const gulp = require('gulp');

const CommentType = require('../model/CommentType');

gulp.task('InsertDefaultCommentTypes' , async ( done )=> {

    try{

        let commentTypes = [
            new CommentType({
                "titleStatus": "Комментарий",
                "dealID": "1"
            }),
            new CommentType({
                "titleStatus": "Личное сообщение",
                "dealID": "2"
            }),
        ];

        for( let i = 0 ; i < commentTypes.length ; i++ ){

            let comment = commentTypes[i];

            console.log(await comment.save());


        }//for i

        return commentTypes;

    }//try
    catch(ex){

        console.log('EXCEPTION!');

    }//catch

    done();

});