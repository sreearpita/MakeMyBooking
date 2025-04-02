const router = require('express').Router();
const Booking = require('../models/booking.model');
const { auth, adminAuth } = require('../middleware/auth');
const mongoose = require('mongoose');

// Admin: Get all bookings with details
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    // Get all bookings regardless of field name
    const bookings = await Booking.find()
      .populate({
        path: 'event',
        model: 'Event'
      })
      .sort({ bookingDate: -1 }); // Most recent first
    
    console.log(`Admin found ${bookings.length} total bookings`);
    res.json(bookings);
  } catch (err) {
    console.error('Error in admin/all:', err);
    res.status(400).json({ message: err.message });
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
    const userId = req.params.userId;
    console.log(`Fetching bookings for user ID: ${userId}`);
    
    // Convert string ID to MongoDB ObjectId
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      console.error('Invalid ObjectId format:', err);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Query using the ObjectId with the field name 'user' instead of 'userId'
    const bookings = await Booking.find({ 
      user: userObjectId
    }).populate('event');
    
    console.log(`Found ${bookings.length} bookings for user ${userId}`);
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(400).json({ message: err.message });
  }
});

// Debug endpoint to check bookings
router.get('/debug/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Debug endpoint - User ID: ${userId}`);
    
    // Try with ObjectId for both field names
    let userIdBookings = [];
    let userBookings = [];
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      
      // Check old field name
      userIdBookings = await Booking.find({ 
        userId: userObjectId 
      }).populate('event');
      
      // Check new field name
      userBookings = await Booking.find({ 
        user: userObjectId 
      }).populate('event');
      
      console.log(`Found ${userIdBookings.length} bookings with userId field`);
      console.log(`Found ${userBookings.length} bookings with user field`);
    } catch (err) {
      console.error('Error converting to ObjectId:', err);
    }
    
    // Combine results (avoiding duplicates)
    const allUserBookings = [...userIdBookings];
    
    // Add bookings from userBookings that aren't already in allUserBookings
    for (const booking of userBookings) {
      if (!allUserBookings.some(b => b._id.toString() === booking._id.toString())) {
        allUserBookings.push(booking);
      }
    }
    
    console.log(`Found ${allUserBookings.length} total bookings for user`);
    
    // Return all found bookings
    res.json({
      userId,
      userIdBookingsCount: userIdBookings.length,
      userBookingsCount: userBookings.length,
      totalBookingsCount: allUserBookings.length,
      matchingBookings: allUserBookings
    });
  } catch (err) {
    console.error('Debug endpoint error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    console.log('Creating booking with data:', req.body);
    
    // Ensure event is an ObjectId
    if (req.body.event && typeof req.body.event === 'string') {
      req.body.event = new mongoose.Types.ObjectId(req.body.event);
    }
    
    // Rename userId to user in the request body
    if (req.body.userId && typeof req.body.userId === 'string') {
      req.body.user = new mongoose.Types.ObjectId(req.body.userId);
      delete req.body.userId; // Remove the old field
    }
    
    const newBooking = new Booking(req.body);
    
    console.log('Booking to be saved:', {
      event: newBooking.event,
      user: newBooking.user,
      name: newBooking.name,
      email: newBooking.email,
      numberOfTickets: newBooking.numberOfTickets,
      totalAmount: newBooking.totalAmount
    });
    
    const savedBooking = await newBooking.save();
    const populatedBooking = await Booking.findById(savedBooking._id).populate('event');
    
    console.log('Saved booking with ID:', savedBooking._id);
    res.json(populatedBooking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(400).json({ message: err.message });
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

// Get booking by ID (for debugging)
router.get('/id/:bookingId', async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    console.log(`Fetching booking with ID: ${bookingId}`);
    
    const booking = await Booking.findById(bookingId).populate('event');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    console.log('Found booking:', {
      _id: booking._id,
      user: booking.user,
      userId: booking.userId,
      name: booking.name,
      email: booking.email
    });
    
    res.json(booking);
  } catch (err) {
    console.error('Error fetching booking by ID:', err);
    res.status(400).json({ message: err.message });
  }
});

// Create test booking for user (for debugging)
router.post('/test-booking', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`Creating test booking for user: ${userId}`);
    
    // Find a random event
    const Event = require('../models/event.model');
    const events = await Event.find();
    
    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found to create test booking' });
    }
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    // Create test booking
    const testBooking = new Booking({
      event: randomEvent._id,
      user: userId,
      name: req.user.name || 'Test User',
      email: req.user.email || 'test@example.com',
      numberOfTickets: 1,
      totalAmount: randomEvent.price || 10,
      status: 'active'
    });
    
    const savedBooking = await testBooking.save();
    const populatedBooking = await Booking.findById(savedBooking._id).populate('event');
    
    console.log('Created test booking:', {
      _id: savedBooking._id,
      user: savedBooking.user,
      event: randomEvent.title
    });
    
    res.json(populatedBooking);
  } catch (err) {
    console.error('Error creating test booking:', err);
    res.status(400).json({ message: err.message });
  }
});

// Admin: Fix all bookings
router.get('/admin/fix-bookings', adminAuth, async (req, res) => {
  try {
    console.log('Starting booking fix operation');
    
    // Find all bookings
    const bookings = await Booking.find();
    console.log(`Found ${bookings.length} total bookings`);
    
    let updatedCount = 0;
    
    // Update each booking
    for (const booking of bookings) {
      let updated = false;
      
      // If booking has userId but not user, copy userId to user
      if (booking.userId && !booking.user) {
        booking.user = booking.userId;
        updated = true;
      }
      
      if (updated) {
        await booking.save();
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} bookings`);
    res.json({ 
      message: 'Booking fix operation completed',
      totalBookings: bookings.length,
      updatedBookings: updatedCount
    });
  } catch (err) {
    console.error('Error fixing bookings:', err);
    res.status(400).json({ message: err.message });
  }
});

// Direct fix endpoint (no auth required for testing)
router.get('/direct-fix', async (req, res) => {
  try {
    console.log('Starting direct booking fix operation');
    
    // Find all bookings
    const bookings = await Booking.find();
    console.log(`Found ${bookings.length} total bookings`);
    
    let updatedCount = 0;
    
    // Update each booking
    for (const booking of bookings) {
      let updated = false;
      
      // If booking has userId but not user, copy userId to user
      if (booking.userId && !booking.user) {
        booking.user = booking.userId;
        updated = true;
      }
      
      if (updated) {
        await booking.save();
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} bookings`);
    res.json({ 
      message: 'Direct booking fix operation completed',
      totalBookings: bookings.length,
      updatedBookings: updatedCount
    });
  } catch (err) {
    console.error('Error fixing bookings:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 