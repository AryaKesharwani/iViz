
const Doubt = require('../models/Doubt');

const getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find();
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doubts', error });
  }
};

// Get a single doubt by ID
const getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (doubt) {
      res.json(doubt);
    } else {
      res.status(404).json({ message: 'Doubt not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doubt', error });
  }
};

// Create a new doubt
const createDoubt = async (req, res) => {
  try {
    const { text, category } = req.body;
    const newDoubt = new Doubt({ text, category });
    await newDoubt.save();
    res.status(201).json(newDoubt);
  } catch (error) {
    res.status(400).json({ message: 'Error creating doubt', error });
  }
};

// Update an existing doubt by ID
const updateDoubt = async (req, res) => {
  try {
    const { text, category } = req.body;
    const doubt = await Doubt.findByIdAndUpdate(
      req.params.id,
      { text, category },
      { new: true, runValidators: true }
    );
    if (doubt) {
      res.json(doubt);
    } else {
      res.status(404).json({ message: 'Doubt not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating doubt', error });
  }
};

// Delete a doubt by ID
const deleteDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findByIdAndDelete(req.params.id);
    if (doubt) {
      res.json({ message: 'Doubt deleted successfully' });
    } else {
      res.status(404).json({ message: 'Doubt not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doubt', error });
  }
};

module.exports = {
  getAllDoubts,
  getDoubtById,
  createDoubt,
  updateDoubt,
  deleteDoubt,
};
