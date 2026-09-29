
import express from "express";
import cors from "cors";

import authRoutes
  from "./routes/authRoutes.js";

import faqRoutes
  from "./routes/faqRoutes.js";

import aiRoutes
  from "./routes/aiRoutes.js";

import errorMiddleware
  from "./middleware/errorMiddleware.js";


const app = express();


// Middleware
app.use(cors());

app.use(express.json());


// Home
app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "FAQ AI Assistant API is running"
  });
});


// Authentication
app.use(
  "/api/auth",
  authRoutes
);


// FAQ
app.use(
  "/api/faqs",
  faqRoutes
);


// AI
app.use(
  "/api/ai",
  aiRoutes
);


// Error handler
app.use(
  errorMiddleware
);


export default app;