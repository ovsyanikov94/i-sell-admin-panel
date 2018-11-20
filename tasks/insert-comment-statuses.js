"use strict";

const gulp = require('gulp');

const CommentStatus = require('../model/CommentStatus');

gulp.task('InsertDefaultCommentStatuses' , async ( done )=> {

    try{

        let commentStatuses = [
            new CommentStatus({
                "commentStatusTitle": "Прочитано",
                "commentStatusID": 1
            }),
            new CommentStatus({
                "commentStatusTitle": "Не прочитано",
                "commentStatusID": 2
            }),
            new CommentStatus({
                "commentStatusTitle": "Удален ",
                "commentStatusID": 3
            }),
        ];

        for( let i = 0 ; i < commentStatuses.length ; i++ ){

            let comment = commentStatuses[i];

            console.log(await comment.save());


        }//for i

        return commentStatuses;

    }//try
    catch(ex){

        console.log('EXCEPTION!' , ex);

    }//catch

    done();

});