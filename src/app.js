import express from "express";
import expressMongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import cors from "cors"; //
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.COR_ORIGIN,
    credentials: true,
  })
);

// Adding middleware to parse incoming JSON requests with a maximum limit of 20KB
app.use(express.json({ limit: "20kb" }));

app.use(cookieParser()); // to perfomr  OPERations ON USER WEB COOKIES
// Sanitize data middleware
app.use(expressMongoSanitize());

// Rate limit middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// importing routes Routes
import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import errorMiddleware from "./middlewares/errorHandlerMiddleware.js";
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("user/api/v1", userRoutes);
app.use("user/api/v1", serviceRoutes);
app.use("booking/api/v1", bookingRoutes);
// handle error and undefined_routes:
app.use(errorMiddleware);
app.use("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});
export { app };
