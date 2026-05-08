const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth');
const analyzeRoutes = require('./routes/analyze');

app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  let mongoUri = process.env.MONGO_URI;
  
  const connectDB = async () => {
    try {
      if (!mongoUri || mongoUri.includes('user:pass@cluster.mongodb.net')) {
        console.log('No valid MONGO_URI provided. Starting in-memory MongoDB for local testing...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
      }
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  };
  
  connectDB();
}

module.exports = app;
