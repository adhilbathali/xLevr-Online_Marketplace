import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

dotenv.config();

const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // MongoDB connection URL
    collectionName: 'sessions', // Collection name in MongoDB
  })

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Keep secret safe
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false, // Set to `true` in production if using HTTPS
    httpOnly: true, // Prevents XSS attacks
    maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
  },
});

export default sessionMiddleware;