const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Routes
// app.use('/api/works', require('./routes/workRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/features', require('./routes/featureRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/team-activities', require('./routes/teamActivityRoutes'));
app.use('/api/team-members', require('./routes/teamMemberRoutes'));
// app.use('/api/users', require('./routes/userRoutes')); // User auth removed
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
