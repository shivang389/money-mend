const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// 🌟 1. IMPORT YOUR AUTH MIDDLEWARE
// Note: Double check that this path matches your actual middleware folder/file!
const auth = require('../middleware/authMiddleware'); 

// 🌟 2. ADD THE 'auth' GUARD TO YOUR ROUTES
// Now, Express will verify the token and populate req.user BEFORE running the controller
router.post('/create', auth, groupController.createGroup);
router.get('/user/:userId', auth, groupController.getUserGroups);

// 🌟 FIXED: Notifications route ABOVE the generic /:groupId route
router.get('/notifications/:groupId', auth, groupController.getNotifications);

router.get('/:groupId', auth, groupController.getGroupDetails);
router.post('/invite', auth, groupController.inviteMember);
router.post('/leave', auth, groupController.leaveGroup);

module.exports = router;