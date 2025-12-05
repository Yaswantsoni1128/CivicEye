import jwt from "jsonwebtoken";

// Generate JWT token with explicit role support
export const generateToken = (user, role = null) => {
  const userRole = role || user.role || "citizen";

  return jwt.sign(
    {
      id: user._id.toString(),
      role: userRole,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
