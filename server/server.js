// server.js
const express = require('express');
const bodyParser = require('body-parser');
const pagesRoutes = require('./routes/pagesRoutes'); // Adjust path if necessary
const cors = require('cors');
require('dotenv').config(); // Load .env file

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Test Route to verify server is working
app.get('/', (req, res) => {
  res.send('Server is running');
});

// User Routes
app.use('/users', pagesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Connected to Database Successfully Buddy....!`)
});