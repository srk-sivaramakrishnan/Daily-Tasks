const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

// Route to get user by ID
router.get('/profile/:id', homeController.getUserById);

// Route to get today's tasks by user ID and date
router.get('/tasks/:id/:date', homeController.getTodaysTasks);

// Route to mark task as completed
router.post('/tasks/complete', homeController.markTaskAsCompleted);

module.exports = router;
