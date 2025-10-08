import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ CORS Setup
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// ✅ Body parser
app.use(express.json());

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jwt-auth-db';
    
    await mongoose.connect(mongoURI, {
      // MongoDB Atlas optimized options
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout for Atlas
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    });
    
    console.log('✅ MongoDB Atlas connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // More detailed error logging for Atlas connections
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Please check your MongoDB Atlas credentials');
    } else if (error.message.includes('network')) {
      console.error('🌐 Please check your network connection and Atlas IP whitelist');
    } else if (error.message.includes('timeout')) {
      console.error('⏱️ Connection timeout - please check Atlas cluster status');
    }
    
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
  
  // MongoDB connection event handlers
  mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB Atlas');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err.message);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB Atlas');
  });
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n📴 Received SIGINT. Graceful shutdown...');
    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB Atlas connection closed.');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('🔍 API Health Check: http://localhost:' + PORT + '/api/health');
    console.log('🔐 Auth Endpoints:');
    console.log('   POST /api/auth/signup');
    console.log('   POST /api/auth/signin');
    console.log('   GET  /api/auth/me');
    console.log('   POST /api/auth/verify-token');
  });
};

startServer();
 