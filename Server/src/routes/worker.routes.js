import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import {
  setEstimatedResolutionDate,
  getAssignedComplaints,
  startComplaint,
  resolveComplaint,
  getPerformance,
} from "../controllers/worker.controller.js";

const router = express.Router();

// -------------------
// 1️⃣ Get Complaints Assigned to Logged-in Worker
// -------------------
router.get(
  "/assigned",
  authMiddleware,
  allowRoles("worker"),
  getAssignedComplaints
);

// -------------------
// 0️⃣ Set estimated resolution date
// -------------------
router.patch(
  "/:id/eta",
  authMiddleware,
  allowRoles("worker"),
  setEstimatedResolutionDate
);

// -------------------
// 2️⃣ Mark Complaint as In Progress
// -------------------
router.patch(
  "/:id/start",
  authMiddleware,
  allowRoles("worker"),
  startComplaint
);

// -------------------
// 3️⃣ Mark Complaint as Resolved with Proof Photo
// -------------------
router.patch(
  "/:id/resolve",
  authMiddleware,
  allowRoles("worker"),
  resolveComplaint
);

// -------------------
// 4️⃣ Worker Performance Stats
// -------------------
router.get(
  "/performance",
  authMiddleware,
  allowRoles("worker"),
  getPerformance
);

export default router;
