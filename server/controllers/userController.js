const csv = require('csv-parser');
const { Readable } = require('stream');
const userModel = require('../models/userModel');

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

// Controller to get user by ID
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

// Controller to add a new task
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

// Controller to upload CSV with tasks directly from memory
exports.uploadCSV = async (req, res) => {
  const user_id = req.params.id;  // Get user_id from URL

  // Check if file is uploaded
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'No file uploaded or file is empty' });
  }

  const buffer = req.file.buffer;  // Get the CSV file from memory
  const tasks = [];

  // Convert the buffer to stream
  const stream = Readable.from(buffer.toString());

  stream
    .pipe(csv())
    .on('data', (row) => {
      // Check if required fields are present
      if (!row.date || !row.day || !row.from_time || !row.to_time || !row.task) {
        return res.status(400).json({ error: 'Missing required fields in CSV' });
      }

      // Convert date format from dd-mm-yyyy to yyyy-mm-dd
      const formattedDate = formatDate(row.date);

      // Push the task to the tasks array
      tasks.push({
        user_id,  // Use the user_id from the URL
        date: formattedDate,
        day: row.day,
        from_time: row.from_time,
        to_time: row.to_time,
        task: row.task
      });
    })
    .on('end', async () => {
      // After reading all the data, insert tasks into the database
      try {
        for (const task of tasks) {
          await userModel.addTask(task);  // Add each task to the database
        }
        res.status(200).json({ message: 'Tasks added successfully from CSV' });
      } catch (error) {
        console.error('Error processing CSV file', error);
        res.status(500).json({ error: 'Error processing CSV file' });
      }
    })
    .on('error', (err) => {
      console.error('Error reading CSV file', err);
      res.status(500).json({ error: 'Error reading CSV file' });
    });
};
