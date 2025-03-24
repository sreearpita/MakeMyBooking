const router = require('express').Router();
const Booking = require('../models/booking.model');
const { auth, adminAuth } = require('../middleware/auth');

// Admin: Get all bookings with details
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'event',
        model: 'Event'
      })
      .sort({ bookingDate: -1 }); // Most recent first
    res.json(bookings);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Admin: Get bookings statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalTickets: { $sum: '$numberOfTickets' }
        }
      }
    ]);
    res.json(stats[0] || { totalBookings: 0, totalRevenue: 0, totalTickets: 0 });
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get bookings by event
router.get('/event/:eventId', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      event: req.params.eventId,
      status: 'active'
    }).populate('event');
    res.json(bookings);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('event');
    res.json(bookings);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get bookings by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      userId: req.params.userId,
      status: 'active'
    }).populate('event');
    res.json(bookings);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    const populatedBooking = await savedBooking.populate('event');
    res.json(populatedBooking);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Cancel booking
router.put('/cancel/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('event');
    
    if (!booking) {
      return res.status(404).json('Booking not found');
    }
    res.json(booking);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router; 