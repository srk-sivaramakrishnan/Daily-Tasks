const db = require('../config/db');

// Existing function to add a task
const addTask = async ({ user_id, date, day, from_time, to_time, task }) => {
  const query = `
    INSERT INTO tasks (user_id, date, day, from_time, to_time, task)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.execute(query, [user_id, date, day, from_time, to_time, task]);
  return result;
};

// New function to get all tasks by user_id
const getAllTasksByUser = async (user_id) => {
  const query = `
    SELECT id, date, day, from_time, to_time, task
    FROM tasks
    WHERE user_id = ?
    ORDER BY date, day
  `;
  const [rows] = await db.execute(query, [user_id]);
  return rows;
};

// New function to update a task by ID
const updateTask = async (taskId, taskDetails) => {
  const { from_time, to_time, task } = taskDetails;
  try {
    await db.execute(
      'UPDATE tasks SET from_time = ?, to_time = ?, task = ? WHERE id = ?',
      [from_time, to_time, task, taskId]
    );
  } catch (error) {
    throw error;
  }
};

// New function to delete a task by ID
const deleteTask = async (taskId) => {
  try {
    await db.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addTask,
  getAllTasksByUser,
  updateTask,  // Export the new function
  deleteTask,  // Export the new function
};
