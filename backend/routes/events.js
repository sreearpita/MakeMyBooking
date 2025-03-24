const router = require('express').Router();
const Event = require('../models/event.model');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get event by id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json('Event not found');
    }
    res.json(event);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add new event
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json('Event not found');
    }
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json('Event not found');
    }
    res.json('Event deleted');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router; 