const express = require('express');
const taskController = require('../controllers/taskController');
const multer = require('multer');

// Set up multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();


// Route to add a new task
router.post('/tasks/add', taskController.addTask);

// Route to upload CSV file with user_id from URL
router.post('/tasks/upload/:id', upload.single('csvFile'), taskController.uploadCSV);

// Route to get all tasks by user_id
router.get('/tasks/:user_id', taskController.getAllTasksByUser);

// Route to update a task by ID
router.put('/tasks/:id', taskController.updateTask);

// Route to delete a task by ID
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
