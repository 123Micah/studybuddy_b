// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const subjectRoutes = require('./routes/subjectRoutes');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/subjects', subjectRoutes);

// Connect to DB and start server
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});