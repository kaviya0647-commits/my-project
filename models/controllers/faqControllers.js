import FAQ from "../FAQ.js";

import {
  generateEmbedding
} from "../../services/geminiService.js";

import {
  cosineSimilarity
} from "../../utils/helpers.js";


// CREATE FAQ
export const createFAQ =
  async (req, res, next) => {
    try {
      const {
        question,
        answer,
        category
      } = req.body;

      const text =
        `${question} ${answer}`;

      const embedding =
        await generateEmbedding(text);

      const faq =
        await FAQ.create({
          question,
          answer,
          category:
            category || "General",
          embedding,
          createdBy: req.user.id
        });

      res.status(201).json({
        message:
          "FAQ created successfully",
        faq
      });

    } catch (error) {
      next(error);
    }
  };


// GET ALL FAQs
export const getFAQs =
  async (req, res, next) => {
    try {
      const faqs =
        await FAQ.find()
          .select("-embedding")
          .populate(
            "createdBy",
            "name email"
          );

      res.status(200).json({
        count: faqs.length,
        faqs
      });

    } catch (error) {
      next(error);
    }
  };


// GET FAQ BY ID
export const getFAQById =
  async (req, res, next) => {
    try {
      const faq =
        await FAQ.findById(
          req.params.id
        )
          .select("-embedding")
          .populate(
            "createdBy",
            "name email"
          );

      if (!faq) {
        return res.status(404).json({
          message: "FAQ not found"
        });
      }

      res.status(200).json({
        faq
      });

    } catch (error) {
      next(error);
    }
  };


// DELETE FAQ
export const deleteFAQ =
  async (req, res, next) => {
    try {
      const faq =
        await FAQ.findById(
          req.params.id
        );

      if (!faq) {
        return res.status(404).json({
          message: "FAQ not found"
        });
      }

      await FAQ.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        message:
          "FAQ deleted successfully"
      });

    } catch (error) {
      next(error);
    }
  };


// SEMANTIC SEARCH
export const semanticSearch =
  async (req, res, next) => {
    try {
      const { query } =
        req.body;

      if (!query) {
        return res.status(400).json({
          message:
            "Search query is required"
        });
      }

      const queryEmbedding =
        await generateEmbedding(query);

      const faqs =
        await FAQ.find();

      const results =
        faqs.map((faq) => {
          const score =
            cosineSimilarity(
              queryEmbedding,
              faq.embedding
            );

          return {
            id: faq._id,
            question:
              faq.question,
            answer:
              faq.answer,
            category:
              faq.category,
            score
          };
        });

      results.sort(
        (a, b) =>
          b.score - a.score
      );

      const topResults =
        results.slice(0, 5);

      res.status(200).json({
        query,
        results: topResults
      });

    } catch (error) {
      next(error);
    }
  };