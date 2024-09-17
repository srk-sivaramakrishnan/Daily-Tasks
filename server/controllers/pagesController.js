const pagesModel = require('../models/pagesModel');

// Signup controller 
exports.signup = async (req, res) => {
  const { name, phone_number, email, password } = req.body;

  try {
    // Check if the user already exists by email or phone number
    const existingUser = await pagesModel.findUserByEmailOrPhone(email, phone_number);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email or phone number already exists!' });
    }

    // Create new user
    await pagesModel.createUser(name, phone_number, email, password);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Signin controller
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await pagesModel.findUserByEmail(email);

    // Check if user exists and password matches
    if (user.length === 0 || user[0].password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return success message
    res.status(200).json({ message: 'Signin successful', user: user[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
