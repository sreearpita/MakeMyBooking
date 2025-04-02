const mongoose = require('mongoose');

// Use the MongoDB connection string directly from your server.js
// Replace this with your actual connection string
const MONGODB_URI = 'mongodb+srv://sreearpitatr:Sree1234@cluster0.ixvxnxl.mongodb.net/event-booking?retryWrites=true&w=majority';

async function updateAllBookings() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get the database and collection
    const db = mongoose.connection.db;
    const bookingsCollection = db.collection('bookings');
    
    // Find all bookings
    const bookings = await bookingsCollection.find({}).toArray();
    console.log(`Found ${bookings.length} total bookings`);
    
    // Update all bookings to ensure they have the user field
    let updatedCount = 0;
    
    for (const booking of bookings) {
      // If booking has userId but not user, copy userId to user
      if (booking.userId && !booking.user) {
        console.log(`Updating booking ${booking._id}: Adding user field from userId`);
        
        await bookingsCollection.updateOne(
          { _id: booking._id },
          { $set: { user: booking.userId } }
        );
        
        updatedCount++;
      }
      // If booking has neither userId nor user, but has a valid event, try to find the user from other bookings
      else if (!booking.userId && !booking.user && booking.email) {
        console.log(`Booking ${booking._id} has no user ID but has email: ${booking.email}`);
        
        // Try to find another booking with the same email that has a user ID
        const similarBooking = bookings.find(b => 
          b.email === booking.email && (b.userId || b.user)
        );
        
        if (similarBooking) {
          const userId = similarBooking.user || similarBooking.userId;
          console.log(`Found similar booking with user ID: ${userId}`);
          
          await bookingsCollection.updateOne(
            { _id: booking._id },
            { $set: { user: userId } }
          );
          
          updatedCount++;
        }
      }
    }
    
    console.log(`Updated ${updatedCount} bookings`);
    console.log('Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

updateAllBookings(); 