const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pagesRoutes = require('./routes/pagesRoutes');
const homeRoutes = require('./routes/homeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const homeModel = require('./models/homeModel'); // Import homeModel to initialize cron jobs
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

// Routes
app.use('/pages', pagesRoutes);
app.use('/home', homeRoutes);
app.use('/tasks', taskRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Connected to Database Successfully`);
});
