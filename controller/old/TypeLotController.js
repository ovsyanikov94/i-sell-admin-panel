/**
 * TypeLotController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  addTypeLot: async (req, res)=>{

    try {

      let typeTitle = req.body.typeTitle;

      let newType = await TypeLot.create({
        "typeTitle": typeTitle
      }).fetch();

      res.send(newType);
    }//try
    catch (ex) {

      res.send(ex);

    }//catch
  },//addStatusLot

  typeList: async (req, res)=>{

    try{

      let types = await TypeLot
        .find()
        .populate('lots' );

      res.send(types);

    }//try
    catch(ex){
      res.send(ex);
    }//catch

  }//statusList

};

