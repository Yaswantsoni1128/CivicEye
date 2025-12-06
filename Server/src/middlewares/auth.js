import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Worker from "../models/worker.model.js";
import Admin from "../models/admin.model.js";

export const authMiddleware = async (req, res, next) => {
    console.log("Cookies received:", req.cookies);
  let token = req.headers["authorization"]?.split(" ")[1] || req.cookies?.token;
  console.log("Token extracted:", token);
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);

    let Model;
    if (decoded.role === "citizen") Model = User;
    else if (decoded.role === "worker") Model = Worker;
    else if (decoded.role === "admin") Model = Admin;
    else return res.status(401).json({ message: "Invalid role in token" });

    const user = await Model.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user._id, role: decoded.role, model: Model };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
