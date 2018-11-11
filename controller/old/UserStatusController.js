/**
 * UserStatusController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  addUserStatus: async ( req, res )=>{

    try{

      let statusTitle = req.body.statusTitle;

      let newStatus = await UserStatus.create({
        "statusTitle": statusTitle
      }).fetch();

      res.send(newStatus);

    } // Try
    catch(ex){

      res.send(ex);

    } // Catch

  }, // addUserStatus

  getUserStatusList: async( req , res )=>{

    try {

      let statuses = await UserStatus
        .find()
        .populate('users' , {
          select: [
            'email',
            'firstName'
          ]
        });

      res.send(statuses);

    } // Try

    catch(ex){
      res.send(ex);
    } // Catch

  } // GetUserStatus

}; // Export

