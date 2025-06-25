const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const verifyUser = require('../middleware/verifyUser');
const upload = require('../middleware/upload');

// Edit (create or update) restaurant profile with file upload
router.put('/profile', verifyUser, upload.single('certFile'), restaurantController.editProfile);

// View restaurant profile
router.get('/profile', verifyUser, restaurantController.getProfile);

module.exports = router;
