/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  

  createUser: async ( req , res )=>{

    try{

      let name = req.body.name;
      let email = req.body.email;
      let roleID = req.body.roleID;
      let phone = req.body.phone;

      let role = await Role.findOne({ id: roleID});

      let newUser = await User.create({
        firstName: name,
        email: email,
        role: role.id,
        phone: phone

      }).fetch();

      //await Role
              // .addToCollection( role.id , 'users' , newUser.id);
              // .addToCollection( role.id , 'users' , [12 , 13 ]);
              //.addToCollection( role.id , 'users')
      //  .members([ newUser.id ]);

      res.send(newUser);

    }//try
    catch(ex){

      res.send(ex);

    }//catch

  },//createUser

  getUserslist: async ( req , res ) => {

    try{

      let users = await User.find({
        skip: 0,
        limit: 10
      }).populate('role');

      console.log('users:' , users);

      res.send( users );

    }//try
    catch(ex){

      res.send(ex);

    }//catch

  }//getUserslist

};

