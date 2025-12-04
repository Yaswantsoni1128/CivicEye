import User from "../models/user.model.js";
import Worker from "../models/worker.model.js";
import Admin from "../models/admin.model.js";
import { generateToken } from "../utils/jwt.js";

// PUBLIC SIGNUP - Citizen only
export const signup = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    if (role && role !== "citizen") {
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

    const validPassword = await user.isValidPassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token, user, role });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};


