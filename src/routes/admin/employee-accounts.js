const express = require('express');
const router = express.Router();
const employeeAccountsManagementController = require('../../public/app/viewsController/EmployeeAccountsManagementController');
const requireAdminLogin = require('../middleware/requireAdminLogin');

router.patch('/xoa', requireAdminLogin, employeeAccountsManagementController.deleteAccount);
router.post('/them', requireAdminLogin, employeeAccountsManagementController.saveNewAccount);
router.get('/them', requireAdminLogin, employeeAccountsManagementController.add);
router.get('/', requireAdminLogin, employeeAccountsManagementController.accounts);

module.exports = router;