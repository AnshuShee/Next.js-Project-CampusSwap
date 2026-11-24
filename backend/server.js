const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

// Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CampusSwap API is up and running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/enquiries', enquiryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] CampusSwap backend running on port ${PORT}`);
});
