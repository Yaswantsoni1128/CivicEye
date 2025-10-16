
export const allowRoles = (...allowedRoles) => (req, res, next) => {
  console.log("req.user", req);
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!allowedRoles.includes(req.user.role))
    return res.status(403).json({ message: "Forbidden" });
  next();
};
