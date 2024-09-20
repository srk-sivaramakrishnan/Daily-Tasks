const db = require('../config/db');
const cron = require('node-cron');

// Function to find user by ID
const findUserById = async (id) => {
  try {
    const [rows] = await db.execute('SELECT name FROM users WHERE id = ?', [id]);
    return rows;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};

// Function to get today's tasks by user ID
const getTodaysTasksByUserId = async (userId, date) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM tasks WHERE user_id = ? AND DATE(date) = ?',
      [userId, date]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching today\'s tasks by user ID:', error);
    throw error;
  }
};

// Function to get completed tasks by user ID
const getCompletedTasksByUserId = async (userId, date) => {
  try {
    const [rows] = await db.execute(
      'SELECT task_id FROM completed_tasks WHERE user_id = ? AND DATE(completed_at) = ?',
      [userId, date]
    );
    return rows.map(row => row.task_id);
  } catch (error) {
    console.error('Error fetching completed tasks by user ID:', error);
    throw error;
  }
};

// Function to mark a task as completed
const markTaskCompleted = async (taskId, userId, completedAt, status = 'completed') => {
  try {
    await db.execute(
      'INSERT INTO completed_tasks (task_id, user_id, completed_at, status) VALUES (?, ?, ?, ?)',
      [taskId, userId, completedAt, status]
    );

    // Update the tasks table to mark the task as completed
    await db.execute(
      'UPDATE tasks SET isCompleted = ? WHERE id = ?',
      ['1', taskId]
    );
  } catch (error) {
    console.error('Error marking task as completed:', error);
    throw error;
  }
};

const markIncompleteTasks = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const now = new Date(); // Current timestamp

    // Fetch all tasks for today that are incomplete
    const [tasks] = await db.execute(
      'SELECT id, user_id FROM tasks WHERE isCompleted = ? AND DATE(date) = ?',
      ['0', today]
    );

    // Insert incomplete tasks into completed_tasks table
    for (const task of tasks) {
      // Check if the task is already in completed_tasks as incomplete to avoid duplication
      const [existing] = await db.execute(
        'SELECT id FROM completed_tasks WHERE task_id = ? AND status = ?',
        [task.id, 'incomplete']
      );
      
      if (existing.length === 0) {
        // Insert into completed_tasks only if not already present
        await db.execute(
          'INSERT INTO completed_tasks (task_id, user_id, completed_at, status) VALUES (?, ?, ?, ?)',
          [task.id, task.user_id, now, 'incomplete']
        );
      }
    }

    console.log('Marked incomplete tasks for the day:', today);
  } catch (error) {
    console.error('Error marking tasks as incomplete:', error);
  }
};



// Schedule the cron job to run at 11:59 PM every day
cron.schedule('09 09 * * *', markIncompleteTasks, {
  timezone: 'Asia/Kolkata', // Specify your timezone
});


module.exports = {
  findUserById,
  getTodaysTasksByUserId,
  getCompletedTasksByUserId,
  markTaskCompleted,
  markIncompleteTasks,
};
