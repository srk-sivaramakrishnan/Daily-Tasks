const db = require('../config/db');

const findUserById = async (id) => {
  const [rows] = await db.execute('SELECT name FROM users WHERE id = ?', [id]);
  return rows;
};

const addTask = async ({ user_id, date, day, from_time, to_time, task }) => {
    const query = `
      INSERT INTO tasks (user_id, date, day, from_time, to_time, task)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [user_id, date, day, from_time, to_time, task]);
    return result;
  };
  
module.exports = {
  findUserById,
  addTask,
};
