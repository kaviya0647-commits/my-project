import FAQ from "../FAQ.js";

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, category, tags = [] } = req.body;

    if (
      typeof question !== "string" || !question.trim() ||
      typeof answer !== "string" || !answer.trim() ||
      typeof category !== "string" || !category.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Question, answer, and category are required"
      });
    }

    if (
      !Array.isArray(tags) ||
      tags.some((tag) => typeof tag !== "string" || !tag.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Tags must be an array of non-empty strings"
      });
    }

    const userId = req.user.id || req.user._id;
    const faq = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
      tags: tags.map((tag) => tag.trim()),
      createdBy: userId
    });

    return res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: faq
    });
  } catch (error) {
    return next(error);
  }
};

export const searchFAQs = async (req, res, next) => {
  try {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const keyword = new RegExp(escapeRegex(query), "i");
    const data = await FAQ.find({
      $or: [
        { question: keyword },
        { answer: keyword },
        { category: keyword },
        { tags: keyword }
      ]
    })
      .select("-embedding")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    return next(error);
  }
};