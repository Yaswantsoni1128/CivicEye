import express from "express";
import Complaint from "../models/complaint.model.js";
import { authMiddleware } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { analyzeComplaintImage } from "../services/genAI.js"; // ✅ import here

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  allowRoles("citizen"),
  async (req, res) => {
    try {
      const { photoUrl, description, location } = req.body;

      if (!photoUrl || !location?.coordinates) {
        return res.status(400).json({ message: "Photo and location are required" });
      }

      // 🔹 Get AI classification + priority
      const { type, priority } = await analyzeComplaintImage(photoUrl);

      // 🔹 Save complaint
      const complaint = await Complaint.create({
        user: req.user.id,
        photoUrl,
        description,
        location,
        type,
        priority,
      });

      res.status(201).json({
        message: "Complaint submitted",
        complaintId: complaint._id,
        classifiedAs: type,
        priority,
      });
    } catch (err) {
      res.status(500).json({
        message: "Failed to submit complaint",
        error: err.message || err,
      });
    }
  }
);


router.get(
  "/my-complaints",
  authMiddleware,
  allowRoles("citizen"),
  async (req, res) => {
    try {
      const complaints = await Complaint.find({ user: req.user.id })
        .populate("assignedTo", "name phone email")
        .sort({ createdAt: -1 });
      res.json({ complaints });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch complaints", error: err });
    }
  }
);


router.get(
  "/:id",
  authMiddleware,
  allowRoles("citizen"),
  async (req, res) => {
    try {
      const complaint = await Complaint.findOne({ _id: req.params.id, user: req.user.id })
        .populate("assignedTo", "name phone email");

      if (!complaint) return res.status(404).json({ message: "Complaint not found" });

      res.json({ complaint });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch complaint", error: err });
    }
  }
);


router.post(
  "/:id/feedback",
  authMiddleware,
  allowRoles("citizen"),
  async (req, res) => {
    try {
      const { feedback } = req.body; // "satisfied" or "not_satisfied"

      const complaint = await Complaint.findOne({ _id: req.params.id, user: req.user.id });
      if (!complaint) return res.status(404).json({ message: "Complaint not found" });
      if (complaint.status !== "resolved")
        return res.status(400).json({ message: "Can only give feedback on resolved complaints" });

      complaint.feedback = feedback;
      await complaint.save();

      res.json({ message: "Feedback submitted", complaint });
    } catch (err) {
      res.status(500).json({ message: "Failed to submit feedback", error: err });
    }
  }
);

export default router;
