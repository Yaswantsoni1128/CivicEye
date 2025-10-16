import express from "express";
import Complaint from "../models/complaint.model.js";
import { authMiddleware } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();


// -------------------
// 1️⃣ Get Complaints Assigned to Logged-in Worker
// -------------------
router.get(
  "/assigned",
  authMiddleware,
  allowRoles("worker"),
  async (req, res) => {
    console.log("outside try block assigned complaints route");
    try {
      console.log("Inside assigned complaints route");
      console.log("req.user", req.user);
      const complaints = await Complaint.find({ assignedTo: req.user.id })
        .populate("user", "name phone email") // who reported
        .sort({ createdAt: -1 });

      res.json({ complaints });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch assigned complaints", error: err });
    }
  }
);


// -------------------
// 2️⃣ Mark Complaint as In Progress
// -------------------
router.patch(
  "/:id/start",
  authMiddleware,
  allowRoles("worker"),
  async (req, res) => {
    try {
      const complaint = await Complaint.findOne({
        _id: req.params.id,
        assignedTo: req.user.id,
      });

      if (!complaint) return res.status(404).json({ message: "Complaint not found or not assigned to you" });

      complaint.status = "in_progress";
      await complaint.save();

      res.json({ message: "Complaint marked as in progress", complaint });
    } catch (err) {
      res.status(500).json({ message: "Failed to update complaint", error: err });
    }
  }
);


// -------------------
// 3️⃣ Mark Complaint as Resolved with Proof Photo
// -------------------
router.patch(
  "/:id/resolve",
  authMiddleware,
  allowRoles("worker"),
  async (req, res) => {
    try {
      const { proofPhotoUrl } = req.body;

      if (!proofPhotoUrl) {
        return res.status(400).json({ message: "Proof photo is required" });
      }

      const complaint = await Complaint.findOne({
        _id: req.params.id,
        assignedTo: req.user.id,
      });

      if (!complaint) return res.status(404).json({ message: "Complaint not found or not assigned to you" });

      complaint.status = "resolved";
      complaint.proofPhotoUrl = proofPhotoUrl;
      complaint.resolvedAt = new Date();

      await complaint.save();

      res.json({ message: "Complaint resolved successfully", complaint });
    } catch (err) {
      res.status(500).json({ message: "Failed to resolve complaint", error: err });
    }
  }
);


// -------------------
// 4️⃣ Worker Performance Stats
// -------------------
router.get(
  "/performance",
  authMiddleware,
  allowRoles("worker"),
  async (req, res) => {
    try {
      console.log("Inside performance route");
      console.log("req.user", req.user);
      const totalAssigned = await Complaint.countDocuments({ assignedTo: req.user.id });
      const resolved = await Complaint.countDocuments({ assignedTo: req.user.id, status: "resolved" });
      const inProgress = await Complaint.countDocuments({ assignedTo: req.user.id, status: "in_progress" });

      res.json({
        totalAssigned,
        resolved,
        inProgress,
        completionRate: totalAssigned > 0 ? ((resolved / totalAssigned) * 100).toFixed(2) + "%" : "0%",
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch performance stats", error: err });
    }
  }
);


export default router;
