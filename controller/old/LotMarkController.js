/**
 * LotMarkController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  //добавление оценки к товару
  addLotMark: async (req, res) => {

    try {

      //получаем айди отправителя, получателя и оценку лота
      let senderID = req.body.senderID;
      let receiverID = req.body.recieverID;
      let mark = req.body.mark;

      //получаем объекты пользователя и лота которым была поставлена оценка
      let user = await User.findOne( { id:senderID } );
      let lot = await Lot.findOne( { id:receiverID } );

      if(!user){
        res.send('Пользователь не найден!');
      }//if
      if(!lot){
        res.send('Лот не найден!');
      }//if

      //если пользователь и лот найдены в базе
      //создаём документ в коллекции базы данных
      let newLotMark = await LotMark.create({

        sender: user,
        receiver: lot,
        mark: mark

      }).fetch();

      res.send(newLotMark);

    }//try
    catch(ex){
      res.send(ex);
    }//catch

  },//addLotMark

  //удаление оценки товара
  removeLotMark: async (req, res) => {

    try{

      //достаём айди оценки определённого пользователя на определённом лоте
      let lotMarkID = req.params.id;

      //если полученная оценка товара найдена...
      if(lotMarkID){

        //...удаляем документ из коллекции
        let removedMark = await LotMark.destroy( { id:lotMarkID } ).fetch();

        res.send(removedMark);

      }//if
      else{
        res.send("Оценка лота не найдена!");
      }//else

    }//try
    catch(ex){
      res.send(ex);
    }//catch

  },//removeLotMark

  //получить список оценок лотов
  lotMarkList: async (req, res) => {

    try{

      //получаем все документы по оценкам лотов...
      let markList = await LotMark.find().populate('sender');

      //...если записи не пусты отправляем
      if(!markList){
        return res.send(markList);
      }//if
      else{
        return res.send("Записей по оценкам НЕТ!");
      }//else


    }//try
    catch(ex){
      res.send(ex);
    }//catch

  },//lotMarkList



};

