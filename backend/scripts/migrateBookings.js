const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Check if MongoDB URI is available
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not defined!');
  console.log('Available environment variables:', Object.keys(process.env));
  process.exit(1);
}

console.log('Using MongoDB URI:', process.env.MONGODB_URI.substring(0, 20) + '...');

const Booking = require('../models/booking.model');

async function migrateBookings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all bookings that have userId but not user
    const bookingsToMigrate = await Booking.find({
      userId: { $exists: true },
      user: { $exists: false }
    });

    console.log(`Found ${bookingsToMigrate.length} bookings to migrate`);

    // Update each booking
    for (const booking of bookingsToMigrate) {
      console.log(`Migrating booking ${booking._id}`);
      
      // Set user field to userId value
      booking.user = booking.userId;
      
      // Save the updated booking
      await booking.save();
      
      console.log(`Successfully migrated booking ${booking._id}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateBookings(); 