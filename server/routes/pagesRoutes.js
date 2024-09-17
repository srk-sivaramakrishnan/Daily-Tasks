const express = require('express');
const pagesController = require('../controllers/pagesController');

const router = express.Router();

// Signup route
router.post('/signup', pagesController.signup);

// Signin route
router.post('/signin', pagesController.signin);

module.exports = router;
