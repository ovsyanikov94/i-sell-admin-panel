const express = require('express');
const router = express.Router();

const userStatusControler = require('../controller/User/UserStatusController');
router.post('/addUserStatus',userStatusControler.AddUserStatus );
router.post('/removeUserStatus',userStatusControler.removeUserStatus );
router.post('/updateUserStatus',userStatusControler.updateStatusDeal );
router.get('/listUserStatus',userStatusControler.ListStatus );

module.exports = router;
