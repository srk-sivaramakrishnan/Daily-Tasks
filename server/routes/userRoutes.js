const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');

// Set up multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Route to get user by ID
router.get('/profile/:id', userController.getUserById);

// Route to add a new task
router.post('/tasks/add', userController.addTask);

// Route to upload CSV file with user_id from URL
router.post('/tasks/upload/:id', upload.single('csvFile'), userController.uploadCSV);

module.exports = router;
