const express = require('express');
const router = express.Router();

const userStatusControler = require('../controller/UserStatusController');
router.post('/addUserStatus',userStatusControler.AddUserStatus );
router.post('/removeUserStatus',userStatusControler.removeUserStatus );
router.post('/updateUserStatus',userStatusControler.updateStatusDeal );
router.get('/listUserStatus',userStatusControler.ListStatus );

module.exports = router;
