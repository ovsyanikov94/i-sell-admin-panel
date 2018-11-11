var express = require('express');
var router = express.Router();

const User = require('../model/User');

/* GET users listing. */
router.post('/user', async function(req, res, next) {
    try{

        let name = req.body.name;

        let newUser= new User({
            'firstName': name
        });

        let result = await newUser.save();

        res.send({
            code: 200,
            data: result,
            message:  'Юзер добавлен!'
        });


    }//try
    catch(ex){

        res.send( ex.message );

    }//catch
});

module.exports = router;
