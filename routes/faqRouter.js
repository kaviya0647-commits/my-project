
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createFAQ,
  getFAQs,
  getFAQById,
  deleteFAQ
} from "../controllers/faqControllers.js";

const router = express.Router();

// Get all FAQs
router.get("/", getFAQs);

// Get single FAQ
router.get("/:id", getFAQById);

// Create FAQ
router.post("/", authMiddleware, createFAQ);

// Delete FAQ
router.delete("/:id", authMiddleware, deleteFAQ);

export default router;