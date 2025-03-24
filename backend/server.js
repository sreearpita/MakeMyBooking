const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { auth } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:4200', // Your Angular app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
const eventsRouter = require('./routes/events');
const bookingsRouter = require('./routes/bookings');
const authRouter = require('./routes/auth');

app.use('/api/events', eventsRouter);
app.use('/api/bookings', auth, bookingsRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
}); 