// controllers/subjectController.js
const Subject = require('../models/Subject');

// @route GET /api/subjects
const getSubjects = async (req, res) => {
  const subjects = await Subject.find({ user: req.user._id });
  res.json(subjects);
};

// @route POST /api/subjects
const createSubject = async (req, res) => {
  const { title, description } = req.body;

  const subject = await Subject.create({
    user: req.user._id,
    title,
    description,
  });

  res.status(201).json(subject);
};

// @route DELETE /api/subjects/:id
const deleteSubject = async (req, res) => {
  const subject = await Subject.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  res.json({ message: 'Subject deleted' });
};

module.exports = {
  getSubjects,
  createSubject,
  deleteSubject,
};
