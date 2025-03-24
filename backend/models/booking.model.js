const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  numberOfTickets: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' }
});

module.exports = mongoose.model('Booking', bookingSchema); 