const express = require('express');
const router = express.Router();
const employeeAccountsManagementController = require('../../public/app/viewsController/EmployeeAccountsManagementController');
const requireAdminLogin = require('../middleware/requireAdminLogin');


router.get('/', requireAdminLogin, employeeAccountsManagementController.accounts);

module.exports = router;