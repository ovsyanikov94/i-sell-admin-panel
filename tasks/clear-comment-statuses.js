
const gulp = require('gulp');

const CommentStatus = require('../model/CommentStatus');


gulp.task('ClearCommentStatuses' , async ( done )=>{

    try{

        console.log(await CommentStatus.deleteMany());

    }//try
    catch(ex){

        console.log(ex)

    }//catch

    done();

});