const express = require('express');
const router = express.Router();

// Controller functions (to be implemented separately)
const {
  getAllDoubts,
  getDoubtById,
  createDoubt,
  updateDoubt,
  deleteDoubt,
} = require('../controllers/doubtController');

// Routes

// GET all doubts
router.get('/', getAllDoubts);

// GET a single doubt by ID
router.get('/:id', getDoubtById);

// POST a new doubt
router.post('/', createDoubt);

// PUT to update an existing doubt by ID
router.put('/:id', updateDoubt);

// DELETE a doubt by ID
router.delete('/:id', deleteDoubt);

const { classifyAndUpdateCategory } = require('../services/googleGenerativeAI');
router.post('/classify-doubt/:id', async (req, res) => {
  try {
    const questionId = req.params.id;
    const updatedDoubt = await classifyAndUpdateCategory(questionId);
    res.status(200).json({ message: 'Doubt updated', doubt: updatedDoubt });
  } catch (error) {
    res.status(500).json({ message: 'Failed to classify and update doubt', error: error.message });
  }
});


module.exports = router;
