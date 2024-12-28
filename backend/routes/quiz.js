
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// CREATE a new question
router.post('/', async (req, res) => {
  try {
    const { text, options, correctAnswer, time } = req.body;
    const question = new Question({ text, options, correctAnswer, time });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ a specific question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a question by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a question by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
