const express = require('express');
const router = express.Router();
const AccessController = require('../controller/AccessController');

const userRoleControler = require('../controller/RoleController');

router.use( AccessController.CheckAccess );

router.get('/list-users-role',userRoleControler.ListRoles );
router.get('/getRoleUserById',userRoleControler.GetRoleByID );

module.exports = router;