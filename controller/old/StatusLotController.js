/**
 * StatusLotController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    addStatusLot: async (req, res)=>{

      try {

        let statusTitle = req.body.statusTitle;

        let newStatus = await StatusLot.create({
          "statusTitle": statusTitle
        }).fetch();

        res.send(newStatus);
      }//try
      catch (ex) {

        res.send(ex);

      }//catch
    },//addStatusLot

  statusList: async (req, res)=>{

    try{

      let status = await StatusLot
        .find()
        .populate('lots' );

      res.send(status);

    }//try
    catch(ex){
      res.send(ex);
    }//catch

  }//statusList

};

