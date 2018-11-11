/**
 * RoleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  addRole: async ( req, res )=>{

    try{

      let roleTitle = req.body.roleTitle;

      let newRole = await Role.create({
        "roleTitle": roleTitle
      }).fetch();

      res.send(newRole);

    }//try
    catch(ex){

      res.send(ex);

    }//catch

  },//addRole
  getRolesList: async( req , res )=>{

    try{

      let roles = await Role
        .find()
        .populate('users' , {
          select: [
            'email',
            'firstName'
          ]
        });

      res.send(roles);

    }
    catch(ex){
      res.send(ex);
    }

  }

};

