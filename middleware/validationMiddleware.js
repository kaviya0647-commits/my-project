
export const validateRegister = (
  req,
  res,
  next
) => {
  const {
    name,
    email,
    password
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message:
        "Name, email and password are required"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message:
        "Password must contain at least 6 characters"
    });
  }

  next();
};


export const validateLogin = (
  req,
  res,
  next
) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message:
        "Email and password are required"
    });
  }

  next();
};


export const validateFAQ = (
  req,
  res,
  next
) => {
  const {
    question,
    answer
  } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      message:
        "Question and answer are required"
    });
  }

  next();
};