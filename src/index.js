import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import testRouter from './routes/testRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import contactsRouter from './routes/contactsRoutes.js';

dotenv.config();

const app = express();

// Set the port from environment variables or default to 3300
app.set('port', process.env.PORT || 3300);

// Configure JSON response formatting for easier readability
app.set('json spaces', 2);

// Define a whitelist of allowed origins for CORS
const whitelist = ["http://localhost:8080", "http://127.0.0.1", "http://localhost:5500"];

// CORS options to allow requests only from whitelisted origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or those in the whitelist
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      console.log(`Origin ${origin} allowed`);
      callback(null, true);
    } else {
      console.error(`Origin ${origin} not allowed`);
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Middleware setup
app.use(morgan('dev')); // HTTP request logger
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
app.use(express.json()); // Parse JSON payloads
app.use(cors(corsOptions)); // Enable CORS with defined options

// Define routes
app.use('/test', testRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

// Start the server on the specified port
app.listen(app.get('port'), () => { 
  console.log(`Server listening on port ${app.get('port')}`);
});
