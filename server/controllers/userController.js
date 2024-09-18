const userModel = require('../models/userModel');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Function to format date from dd-mm-yyyy to yyyy-mm-dd
const formatDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

// Function to validate user ID
const validateUserId = async (userId) => {
  const user = await userModel.findUserById(userId);
  return user.length > 0;
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findUserById(userId);
    if (user.length > 0) {
      res.status(200).json({ username: user[0].name });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addTask = async (req, res) => {
  const { user_id, date, day, from_time, to_time, task } = req.body;
  try {
    const result = await userModel.addTask({ user_id, date, day, from_time, to_time, task });
    res.status(201).json({ message: 'Task added successfully', taskId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Task with the same date and time already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

exports.uploadCSV = async (req, res) => {
  const user_id = req.params.id;  // Get user_id from URL
  const filePath = path.join(__dirname, '../uploads/', req.file.filename);

  const tasks = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // Check if required fields are present
      if (!row.date || !row.day || !row.from_time || !row.to_time || !row.task) {
        return res.status(400).json({ error: 'Missing required fields in CSV' });
      }

      // Convert date format from dd-mm-yyyy to yyyy-mm-dd
      const formattedDate = formatDate(row.date);

      // Add the user_id from URL to the task object
      tasks.push({
        user_id,  // Use the user_id from URL
        date: formattedDate,
        day: row.day,
        from_time: row.from_time,
        to_time: row.to_time,
        task: row.task
      });
    })
    .on('end', async () => {
      try {
        for (const task of tasks) {
          await userModel.addTask(task);  // Add each task with correct user_id
        }
        fs.unlinkSync(filePath);  // Remove file after processing
        res.status(200).json({ message: 'Tasks added successfully from CSV' });
      } catch (error) {
        console.error('Error processing CSV file', error);
        res.status(500).json({ error: 'Error processing CSV file' });
      }
    });
};
