import express from "express";
import expressMongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

const app = express();

// Bodyparser middleware

app.use(express.json());

// Sanitize data middleware

app.use(expressMongoSanitize());

// Rate limit middleware

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Routes

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// handle undefined routes

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

export default app;
