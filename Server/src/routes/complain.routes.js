import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  submitFeedback,
  submitRating,
} from "../controllers/complain.controller.js";

const router = express.Router();

router.post("/", authMiddleware, allowRoles("citizen"), createComplaint);

router.get(
  "/my-complaints",
  authMiddleware,
  allowRoles("citizen"),
  getMyComplaints
);

router.get("/:id", authMiddleware, allowRoles("citizen"), getComplaintById);

router.post(
  "/:id/feedback",
  authMiddleware,
  allowRoles("citizen"),
  submitFeedback
);

router.post(
  "/:id/rating",
  authMiddleware,
  allowRoles("citizen"),
  submitRating
);

export default router;
