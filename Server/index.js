import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import UploadRoute from './Routes/UploadRoute.js';

// Load environment variables
dotenv.config();

import { DB_NAME } from './constant.js'; // Only needed if your Mongo URI doesn't include DB

// Initialize express app
const app = express();

// Serve static files
app.use(express.static('public'));
app.use('/images', express.static('images'));

// Middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// MongoDB connection
const connectDb = async () => {
  try {
    // Use this if your MONGO_DB **does NOT** include the DB name
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB}/${DB_NAME}`
    );

    // OR use this if your MONGO_DB already includes DB name (comment out the line above)
    // const connectionInstance = await mongoose.connect(process.env.MONGO_DB);

    console.log(`\nMongoDB connected!! DB HOST: ${connectionInstance.connection.host}`);
  } catch (err) {
    console.log("MONGODB connection error:", err.message);
    throw err;
  }
};

// Start the server
const PORT = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed!", err);
  });

// Routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/upload', UploadRoute);
