const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Get MongoDB URI from environment or use a default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-booking';

console.log('Using MongoDB URI:', MONGODB_URI.substring(0, 20) + '...');

async function fixBookings() {
  try {
    // Connect to MongoDB directly
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the Booking collection
    const db = conn.connection.db;
    const bookingsCollection = db.collection('bookings');
    
    // Find all bookings
    const bookings = await bookingsCollection.find({}).toArray();
    console.log(`Found ${bookings.length} total bookings`);
    
    // Count bookings with userId but no user
    const bookingsToFix = bookings.filter(b => b.userId && !b.user);
    console.log(`Found ${bookingsToFix.length} bookings to fix`);
    
    // Update each booking
    for (const booking of bookingsToFix) {
      console.log(`Fixing booking ${booking._id}`);
      
      // Update the booking to add user field
      await bookingsCollection.updateOne(
        { _id: booking._id },
        { $set: { user: booking.userId } }
      );
      
      console.log(`Successfully fixed booking ${booking._id}`);
    }
    
    console.log('Fix completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Fix failed:', error);
    process.exit(1);
  }
}

fixBookings(); 