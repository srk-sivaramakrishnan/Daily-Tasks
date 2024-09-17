const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to get user by ID
router.get('/profile/:id', userController.getUserById);

// Route to add a new task
router.post('/tasks/add', userController.addTask);

// Route to upload CSV file with user_id from URL
router.post('/tasks/upload/:id', upload.single('csvFile'), userController.uploadCSV);

module.exports = router;
