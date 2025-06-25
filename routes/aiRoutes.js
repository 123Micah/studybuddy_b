// routes/aiRoutes.js
const express = require('express');
const { generateContent } = require('../controllers/aiController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/generate', protect, generateContent);

module.exports = router;
