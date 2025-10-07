import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ CORS Setup
app.use(cors({
  origin: 'http://localhost:5177', // Vite default port
  credentials: true
}));

// ✅ Body parser
app.use(express.json());

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jwt-auth-db';
    
    await mongoose.connect(mongoURI, {
      // Options for MongoDB Atlas
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8080,
      socketTimeoutMS: 48080,
    });
    
    console.log('✅ MongoDB Atlas connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', port: PORT, timestamp: new Date().toISOString() });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ✅ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
