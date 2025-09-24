import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';

// Import Routers
import articleRouter from './routes/articles.js';
import authRouter from './routes/auth.route.js';

// Create an Express app
const app = express();

// Global Middleware
app.use(express.json());
app.use(cors());

// Connect Routes
app.use('/api/articles', articleRouter);
app.use('/api/auth', authRouter);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit with failure
  }
}

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Set the server port
const port = process.env.PORT || 5000;

// Start the server after connecting to the database
async function startServer() {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();