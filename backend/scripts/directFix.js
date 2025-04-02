const mongoose = require('mongoose');

// Use a modified MongoDB connection string without the SRV format
const MONGODB_URI = 'mongodb://sreearpitatr:Sree1234@cluster0.ixvxnxl.mongodb.net/event-booking?retryWrites=true&w=majority';

console.log('Using MongoDB URI:', MONGODB_URI.substring(0, 20) + '...');

async function fixBookings() {
  try {
    // Connect to MongoDB directly
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
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
    
    // Also check for bookings with user field but wrong format
    const allBookings = await bookingsCollection.find({}).toArray();
    const bookingsWithStringUser = allBookings.filter(b => 
      b.user && typeof b.user === 'string' && mongoose.Types.ObjectId.isValid(b.user)
    );
    
    console.log(`Found ${bookingsWithStringUser.length} bookings with string user IDs`);
    
    // Convert string user IDs to ObjectId
    for (const booking of bookingsWithStringUser) {
      console.log(`Converting user ID for booking ${booking._id}`);
      
      await bookingsCollection.updateOne(
        { _id: booking._id },
        { $set: { user: new mongoose.Types.ObjectId(booking.user) } }
      );
      
      console.log(`Successfully converted user ID for booking ${booking._id}`);
    }
    
    console.log('Fix completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Fix failed:', error);
    process.exit(1);
  }
}

fixBookings(); 