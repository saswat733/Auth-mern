import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from '../api/routes/user.route.js';
import authRoute from '../api/routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Check if required environment variables are present
if (!process.env.MONGO) {
  console.error('Missing MongoDB connection string in environment variables');
  process.exit(1); // Exit the process with an error code
}

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process with an error code
  });

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

// Handle 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    statusCode: 404,
  });
});

// Generic Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
