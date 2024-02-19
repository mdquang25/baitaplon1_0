const express = require('express');
const router = express.Router();
const employeeAccountsController = require('../../public/app/viewsController/admin/EmployeeAccountsController');
const requireAdminLogin = require('../middleware/requireAdminLogin');

router.patch('/xoa', requireAdminLogin, employeeAccountsController.deleteAccount);
router.post('/them', requireAdminLogin, employeeAccountsController.saveNewAccount);
router.get('/them', requireAdminLogin, employeeAccountsController.add);
router.get('/', requireAdminLogin, employeeAccountsController.accounts);

module.exports = router;