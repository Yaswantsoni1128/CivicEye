import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import {
  getComplaints,
  assignComplaint,
  updateComplaint,
  getReports,
  getWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/complaints", authMiddleware, allowRoles("admin"), getComplaints);

router.put(
  "/complaints/:id/assign",
  authMiddleware,
  allowRoles("admin"),
  assignComplaint
);

router.put(
  "/complaints/updateComplain/:id",
  authMiddleware,
  allowRoles("admin"),
  updateComplaint
);

// -------------------
// 4️⃣ Complaint Reports (basic analytics)
// -------------------
router.get("/reports", authMiddleware, allowRoles("admin"), getReports);

router.get("/workers", authMiddleware, allowRoles("admin"), getWorkers);

router.post("/workers", authMiddleware, allowRoles("admin"), createWorker);

router.put("/workers/:id", authMiddleware, allowRoles("admin"), updateWorker);

router.delete(
  "/workers/:id",
  authMiddleware,
  allowRoles("admin"),
  deleteWorker
);
export default router;
