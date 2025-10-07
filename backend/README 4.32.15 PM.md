# JWT Authentication Server with MongoDB Atlas

This is a Node.js Express server that provides JWT authentication with MongoDB Atlas integration.

## Features

- ✅ JWT token-based authentication
- ✅ MongoDB Atlas cloud database integration
- ✅ User registration and login
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ CORS configuration for frontend integration

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Environment Variables:**
   The `.env` file is already configured with:
   - MongoDB Atlas connection string
   - JWT secret (change in production!)
   - Server port (8080)

3. **Start the server:**
   ```bash
   npm run dev    # Development with nodemon
   # or
   npm start      # Production
   ```

## API Endpoints

### Authentication Routes

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user  
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/signout` - Logout user (protected)
- `POST /api/auth/refresh` - Refresh JWT token (protected)

### Health Check
- `GET /api/health` - Server health status

## Database

Connected to MongoDB Atlas cluster:
- Cluster: `cluster0.tl3prmb.mongodb.net`
- Database: `jwt-auth-db`
- Collection: `users`

## Frontend Integration

The frontend React app expects the server to run on `http://localhost:8080`

## Security Features

- Password hashing with bcrypt (salt rounds: 12)
- JWT tokens with expiration
- Protected routes middleware
- Input validation
- Error handling