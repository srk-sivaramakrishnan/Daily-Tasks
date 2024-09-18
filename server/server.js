const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pagesRoutes = require('./routes/pagesRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors());
app.options('*', cors());

// Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  next();
});

// Pages Routes
app.use('/pages', pagesRoutes);

// User Routes
app.use('/users', userRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Connected to Database Successfully`); // Ensure you have actual DB connection setup
});
