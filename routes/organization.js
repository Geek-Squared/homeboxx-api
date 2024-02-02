const express = require('express');
const router = express.Router();
const organizationsController = require('../controllers/orgController');
const verifyToken  = require('../middlewares/auth');

router.get('/', verifyToken, organizationsController.getAllOrganizations);
router.get('/:orgId', verifyToken, organizationsController.getOrganization);
router.post('/', verifyToken, organizationsController.createOrganization);
router.put('/:orgId/members', verifyToken, organizationsController.addMemberToOrganization);
router.put('/:orgId', verifyToken, organizationsController.updateOrganization);
router.delete('/:orgId', verifyToken, organizationsController.deleteOrganization);

module.exports = router;