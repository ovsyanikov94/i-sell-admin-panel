
const gulp = require('gulp');

const CommentType = require('../model/CommentType');


gulp.task('ClearCommentTypes' , async ( done )=>{

    try{

        console.log(await CommentType.deleteMany());

    }//try
    catch(ex){

        console.log(ex)

    }//catch

    done();

});