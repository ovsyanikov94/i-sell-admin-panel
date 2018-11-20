"use strict";

const gulp = require('gulp');

const CommentType = require('../model/CommentType');

gulp.task('InsertDefaultCommentTypes' , async ( done )=> {

    try{

        let commentTypes = [
            new CommentType({
                "commentTypeTitle": "Комментарий",
                "commentTypeID": 1
            }),
            new CommentType({
                "commentTypeTitle": "Личное сообщение",
                "commentTypeID": 2
            }),
        ];

        for( let i = 0 ; i < commentTypes.length ; i++ ){

            let comment = commentTypes[i];

            console.log(await comment.save());


        }//for i

        return commentTypes;

    }//try
    catch(ex){

        console.log('EXCEPTION!' , ex);

    }//catch

    done();

});