const taskModel = require('../models/taskModel');
const csv = require('csv-parser');
const { Readable } = require('stream');


// Existing controller to add a new task
exports.addTask = async (req, res) => {
  const { user_id, date, day, from_time, to_time, task } = req.body;
  try {
    const result = await taskModel.addTask({ user_id, date, day, from_time, to_time, task });
    res.status(201).json({ message: 'Task added successfully', taskId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Task with the same date and time already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

// Existing function to format date from dd-mm-yyyy to yyyy-mm-dd
const formatDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

// Existing controller to upload CSV with tasks directly from memory
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
          await taskModel.addTask(task);  // Add each task to the database
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

// New controller to get all tasks by user_id
exports.getAllTasksByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const tasks = await taskModel.getAllTasksByUser(user_id);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// New controller to update a task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { from_time, to_time, task } = req.body;
  try {
    await taskModel.updateTask(id, { from_time, to_time, task });
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// New controller to delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await taskModel.deleteTask(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
