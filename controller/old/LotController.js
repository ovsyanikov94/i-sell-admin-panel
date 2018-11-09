/**
 * LotController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  createLot: async ( req , res )=>{

    try{

      let categoriesIds = req.body.categories;

      let categories = await Category.find({
        id: categoriesIds
      });

      categoriesIds = categories.map( c => c.id );

      let lotTitle = req.body.lotTitle;


      //TrehubKisilova

      let customerLotID = req.body.customerID;

      let customerLot = await User.findOne({ id: customerLotID});

      let sellerLotID = req.body.sellerID;

      let sellerLot = await User.findOne({ id: sellerLotID});

      let lotDescription = req.body.lotDescription;

      let lotImagePath = req.body.lotImagePath;

      let startPrice = req.body.startPrice;

      let mapLot = req.body.mapLot;

      let currentRate = req.body.currentRate;

      let dateAdminAnswer = req.body.dateAdminAnswer;

      let datePlacement = req.body.datePlacement;

      let dateStartTrade = req.body.dateStartTrade;

      let dateEndTrade = req.body.dateEndTrade;

      let newLot = await Lot.create({
        'lotTitle': lotTitle,
        'customer': customerLot.id,
        'seller': sellerLot.id,
        'lotDescription': lotDescription,
        'lotImagePath': lotImagePath,
        'startPrice': startPrice,
        'mapLot': mapLot,
        'currentRate': currentRate,
        'dateAdminAnswer': dateAdminAnswer,
        'datePlacement': datePlacement,
        'dateStartTrade': dateStartTrade,
        'dateEndTrade': dateEndTrade,

      }).fetch();

      await Lot
        .addToCollection(newLot.id , 'categories')
        .members( categoriesIds );

      res.send( newLot );

    }//try
    catch(ex){

      res.send(ex);

    }//catch

  },//createLot

  getLotList: async (req , res) => {

    let lots = await Lot.find().populate('categories');

    res.send(lots);

  },

  deleteLot: async(req, res)=>{


    try {

      let lotId = req.param(id);

      if(_.isString(lotId)){

        let delLot =  await Lot.destroy({
          id: lotId
        });

        if (delLot.length === 0) {
          console.log("Лот с таким id не существует");
        } //if
        else {
          console.log("Лот с таким id удален")
        }//else

        req.send(delLot);
      }//if

    }//try
    catch(ex){
      res.send(ex);
    }//catch

  }

};

