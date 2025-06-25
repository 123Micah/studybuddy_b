// routes/subjectRoutes.js
const express = require('express');
const {
  getSubjects,
  createSubject,
  deleteSubject,
} = require('../controllers/subjectController');

const protect = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getSubjects)
  .post(protect, createSubject);

router.delete('/:id', protect, deleteSubject);

module.exports = router;
