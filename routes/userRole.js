const express = require('express');
const router = express.Router();

const userRoleControler = require('../controller/User/RoleController');


router.get('/listUsersRole',userRoleControler.ListRoles );
router.get('/getRoleUserById',userRoleControler.GetRoleByID );
router.post('/addRole',userRoleControler.AddUserRole );

module.exports = router;