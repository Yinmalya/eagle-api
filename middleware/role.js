export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Not authorized as admin" });
};

export const isContributorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "contributor" || req.user.role === "admin")) return next();
  return res.status(403).json({ message: "Not authorized" });
};
