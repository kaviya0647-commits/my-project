import jwt from "jsonwebtoken";

const authMiddleware = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message:
          "A Bearer authorization token is required"
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({
        message:
          "Invalid or expired token"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.id && !decoded._id) {
      return res.status(401).json({
        message:
          "Invalid or expired token"
      });
    }

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message:
        "Invalid or expired token"
    });
  }
};

export default authMiddleware;