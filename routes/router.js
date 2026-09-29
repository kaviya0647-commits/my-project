router.get(
  "/profile",
  authMiddleware,
  getUserProfile
);