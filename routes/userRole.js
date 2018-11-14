const express = require('express');
const router = express.Router();

const userRoleControler = require('../controller/RoleController');

router.get('/list-users-role',userRoleControler.ListRoles );

module.exports = router;