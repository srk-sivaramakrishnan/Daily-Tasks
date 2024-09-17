const db = require('../config/db');

// Create user in the database
const createUser = async (name, phone_number, email, password) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, phone_number, email, password) VALUES (?, ?, ?, ?)',
    [name, phone_number, email, password]
  );
  return result;
};

// Check if email or phone number already exists
const findUserByEmailOrPhone = async (email, phone_number) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR phone_number = ?', [email, phone_number]);
  return rows;
};

// Find user by email (for signin)
const findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows;
};

module.exports = {
  createUser,
  findUserByEmailOrPhone,
  findUserByEmail
};
