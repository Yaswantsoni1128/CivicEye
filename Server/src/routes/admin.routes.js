import express from "express";
import Complaint from "../models/complaint.model.js";
import User from "../models/user.model.js"; 
import Worker from "../models/worker.model.js"; 
import { authMiddleware } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/complaints",
  authMiddleware,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { type, status, priority } = req.query;
      const filter = {};

      if (type) filter.type = type;
      if (status) filter.status = status;
      if (priority) filter.priority = priority;

      const complaints = await Complaint.find(filter)
        .populate("user", "name email") // citizen who submitted
        .populate("assignedTo", "name email phone") // worker handling
        .sort({ createdAt: -1 });

      res.json({ complaints });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch complaints", error: err });
    }
  }
);

router.put(
  "/complaints/:id/assign",
  authMiddleware,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { workerId } = req.body;

      const worker = await Worker.findById(workerId);
      if (!worker) return res.status(404).json({ message: "Worker not found" });

      const complaint = await Complaint.findById(req.params.id);
      if (!complaint) return res.status(404).json({ message: "Complaint not found" });

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
      res
        .status(500)
        .json({ message: "Failed to assign complaint", error: err.message });
    }
  }
);


router.put(
  "/complaints/updateComplain/:id",
  authMiddleware,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { status, priority, type } = req.body;

      const complaint = await Complaint.findById(req.params.id);
      if (!complaint) return res.status(404).json({ message: "Complaint not found" });

      if (status) complaint.status = status;
      if (priority) complaint.priority = priority;
      if (type) complaint.type = type;

      await complaint.save();

      res.json({ message: "Complaint updated", complaint });
    } catch (err) {
      res.status(500).json({ message: "Failed to update complaint", error: err });
    }
  }
);

// -------------------
// 4️⃣ Complaint Reports (basic analytics)
// -------------------
router.get(
  "/reports",
  authMiddleware,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const total = await Complaint.countDocuments();
      const resolved = await Complaint.countDocuments({ status: "resolved" });
      const inProgress = await Complaint.countDocuments({ status: "in_progress" });
      const pending = await Complaint.countDocuments({ status: "received" });

      const byType = await Complaint.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } }
      ]);

      const byPriority = await Complaint.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } }
      ]);

      res.json({
        total,
        resolved,
        inProgress,
        pending,
        byType,
        byPriority
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to generate report", error: err });
    }
  }
);

export default router;
