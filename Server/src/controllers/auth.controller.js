import User from "../models/user.model.js";
import Worker from "../models/worker.model.js";
import Admin from "../models/admin.model.js";
import { generateToken } from "../utils/jwt.js";

// PUBLIC SIGNUP - Citizen only
export const signup = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;
    const requestedRole = (role || "citizen").toLowerCase().trim();

    // --- First-admin bootstrap: allow admin signup only if no admins exist ---
    if (requestedRole === "admin") {
      const adminCount = await Admin.countDocuments();
      if (adminCount > 0) {
        return res.status(403).json({
          message:
            "Admin signup is only allowed for the first admin. Ask an existing admin to create more admins.",
        });
      }

      const existingAdmin = await Admin.findOne({ phone });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const hashedAdminPassword = await Admin.hashPassword(password);
      const admin = await Admin.create({
        name,
        phone,
        email,
        password: hashedAdminPassword,
      });

      // Keep a matching User entry for consistency and login
      const hashedUserPassword = await User.hashPassword(password);
      const user = await User.create({
        name,
        phone,
        email,
        password: hashedUserPassword,
        role: "admin",
      });

      admin.user = user._id;
      await admin.save();

      const token = generateToken(admin, "admin");
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const adminData = admin.toObject ? admin.toObject() : admin;
      if (adminData.password) delete adminData.password;
      adminData.role = "admin";

      return res.status(201).json({ token, user: adminData, role: "admin" });
    }

    // Default: citizen signup only
    if (requestedRole && requestedRole !== "citizen") {
      return res
        .status(403)
        .json({ message: "Cannot signup as admin or worker" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ token, user, role: "citizen" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err });
  }
};

// ADMIN ONLY - Create Worker
export const createWorkerByAdmin = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const existingWorker = await Worker.findOne({ phone });
    if (existingWorker) {
      return res.status(400).json({ message: "Worker already exists" });
    }

    const hashedPassword = await Worker.hashPassword(password);

    const worker = await Worker.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ worker });
  } catch (err) {
    res.status(500).json({ message: "Worker creation failed", error: err });
  }
};

// ADMIN ONLY - Create Admin
export const createAdmin = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ phone });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await Admin.hashPassword(password);

    const admin = await Admin.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ admin });
  } catch (err) {
    res.status(500).json({ message: "Admin creation failed", error: err });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { phone, password, role } = req.body;

    let Model;
    if (role === "citizen") Model = User;
    else if (role === "worker") Model = Worker;
    else if (role === "admin") Model = Admin;
    else return res.status(400).json({ message: "Invalid role" });

    const user = await Model.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Extra safety: for citizen logins via User model, ensure stored role matches
    if (Model === User && user.role && user.role !== role) {
      return res
        .status(403)
        .json({
          message: `Account role mismatch. This account is '${user.role}' and cannot log in as '${role}'.`,
        });
    }

    const validPassword = await user.isValidPassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Explicitly include role in token so auth middleware can distinguish models
    const token = generateToken(user, role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Ensure response.user has role but not password
    const userData = user.toObject ? user.toObject() : user;
    if (userData.password) delete userData.password;
    userData.role = role;

    res.status(200).json({ token, user: userData, role });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};


