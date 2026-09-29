
import express from "express";

import {
  register,
  login,
  getUserProfile
} from "../models/controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  validateRegister,
  validateLogin
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Register
router.post(
  "/register",
  validateRegister,
  register
);

// Login
router.post(
  "/login",
  validateLogin,
  login
);

// Profile
router.get(
  "/profile",
  authMiddleware,
  getUserProfile
);

export default router;