import Complaint from "../models/complaint.model.js";
import Worker from "../models/worker.model.js";
import User from "../models/user.model.js";

// Helpers
const sanitizeWorker = (workerDoc) => {
  const worker = workerDoc.toObject ? workerDoc.toObject() : workerDoc;
  delete worker.password;
  worker.assignedCount = worker.assignedComplaints
    ? worker.assignedComplaints.length
    : 0;
  worker.completedCount = worker.completedComplaints
    ? worker.completedComplaints.length
    : 0;
  return worker;
};

// Complaints list with filters
export const getComplaints = async (req, res) => {
  try {
    const { type, status, priority } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate("user", "name email")
      .populate("assignedTo", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch complaints", error: err });
  }
};

// Assign complaint to worker
export const assignComplaint = async (req, res) => {
  try {
    const { workerId } = req.body;

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    complaint.assignedTo = worker._id;
    complaint.status = "in_progress";
    await complaint.save();

    if (!worker.assignedComplaints.includes(complaint._id)) {
      worker.assignedComplaints.push(complaint._id);
      await worker.save();
    }

    res.json({
      message: "Complaint assigned successfully",
      complaint,
      worker,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to assign complaint",
      error: err.message,
    });
  }
};

// Update complaint (status, priority, type)
export const updateComplaint = async (req, res) => {
  try {
    const { status, priority, type } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    if (type) complaint.type = type;

    await complaint.save();

    res.json({ message: "Complaint updated", complaint });
  } catch (err) {
    res.status(500).json({ message: "Failed to update complaint", error: err });
  }
};

// Complaint reports / analytics
export const getReports = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const inProgress = await Complaint.countDocuments({
      status: "in_progress",
    });
    const pending = await Complaint.countDocuments({ status: "received" });

    const byType = await Complaint.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const byPriority = await Complaint.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    res.json({
      total,
      resolved,
      inProgress,
      pending,
      byType,
      byPriority,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to generate report", error: err });
  }
};

// Worker list
export const getWorkers = async (_req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json({
      workers: workers.map(sanitizeWorker),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workers", error: err });
  }
};

// Create worker (admin panel)
export const createWorker = async (req, res) => {
  try {
    const { name, phone, email, password, status = "active" } = req.body;

    if (!name || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Name, phone, and password are required" });
    }

    const existingWorker = await Worker.findOne({ phone });
    if (existingWorker) {
      return res
        .status(400)
        .json({ message: "Worker already exists with this phone number" });
    }

    const hashedPassword = await Worker.hashPassword(password);

    const worker = await Worker.create({
      name,
      phone,
      email,
      password: hashedPassword,
      status,
    });

    // Also ensure there is a corresponding User document with role "worker"
    try {
      let user = await User.findOne({ phone });
      if (user) {
        // Upgrade existing user to worker role and link worker id
        user.name = name;
        if (email !== undefined) user.email = email;
        user.role = "worker";
        user.worker = worker._id;
        // Optionally sync password as well
        user.password = await User.hashPassword(password);
        await user.save();
      } else {
        const userHashedPassword = await User.hashPassword(password);
        user = await User.create({
          name,
          phone,
          email,
          password: userHashedPassword,
          role: "worker",
          worker: worker._id,
        });
      }
    } catch (userErr) {
      // Don't fail the whole request if user sync fails; just log
      console.error("Failed to sync worker to User model:", userErr);
    }

    res.status(201).json({ worker: sanitizeWorker(worker) });
  } catch (err) {
    res.status(500).json({ message: "Worker creation failed", error: err });
  }
};

// Update worker
export const updateWorker = async (req, res) => {
  try {
    const { name, phone, email, status, password } = req.body;

    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    if (phone && phone !== worker.phone) {
      const existingWorker = await Worker.findOne({ phone });
      if (existingWorker) {
        return res
          .status(400)
          .json({ message: "Another worker with this phone already exists" });
      }
    }

    const originalPhone = worker.phone;

    if (name) worker.name = name;
    if (phone) worker.phone = phone;
    if (email !== undefined) worker.email = email;
    if (status) worker.status = status;
    if (password) {
      worker.password = await Worker.hashPassword(password);
    }

    await worker.save();

    // Keep corresponding User document in sync
    try {
      // Prefer lookup by worker reference, fallback to phone
      let user = await User.findOne({ worker: worker._id });
      if (!user) {
        user = await User.findOne({ phone: originalPhone });
      }

      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (email !== undefined) user.email = email;
        // Ensure role and worker link remain correct
        user.role = "worker";
        user.worker = worker._id;
        if (password) {
          user.password = await User.hashPassword(password);
        }
        await user.save();
      }
    } catch (userErr) {
      console.error("Failed to sync updated worker to User model:", userErr);
    }

    res.json({ worker: sanitizeWorker(worker) });
  } catch (err) {
    res.status(500).json({ message: "Failed to update worker", error: err });
  }
};

// Delete worker
export const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    // Also delete any corresponding user record (matched by phone)
    if (worker.phone) {
      await User.deleteOne({ phone: worker.phone });
    }

    res.json({ message: "Worker deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete worker", error: err });
  }
};


