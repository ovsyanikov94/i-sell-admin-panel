"use strict";

const gulp = require('gulp');

const CommentStatus = require('../model/CommentStatus');

gulp.task('InsertDefaultCommentStatuses' , async ( done )=> {

    try{

        let commentStatuses = [
            new CommentStatus({
                "titleStatus": "Прочитано",
                "dealID": "1"
            }),
            new CommentStatus({
                "titleStatus": "Не прочитано",
                "dealID": "2"
            }),
            new CommentStatus({
                "titleStatus": "Удален ",
                "dealID": "3"
            }),
        ];

        for( let i = 0 ; i < commentStatuses.length ; i++ ){

            let comment = commentStatuses[i];

            console.log(await comment.save());


        }//for i

        return commentStatuses;

    }//try
    catch(ex){

        console.log('EXCEPTION!');

    }//catch

    done();

});