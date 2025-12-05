import Complaint from "../models/complaint.model.js";

// 0️⃣ Set estimated resolution date for assigned complaint
export const setEstimatedResolutionDate = async (req, res) => {
  try {
    const { estimatedResolutionDate } = req.body;

    if (!estimatedResolutionDate) {
      return res
        .status(400)
        .json({ message: "estimatedResolutionDate is required" });
    }

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found or not assigned to you",
      });
    }

    complaint.estimatedResolutionDate = new Date(estimatedResolutionDate);
    // If admin marked it received, ensure it moves to in_progress when ETA set
    if (complaint.status === "received") {
      complaint.status = "in_progress";
    }

    await complaint.save();

    res.json({
      message: "Estimated resolution date saved",
      complaint,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to set estimated resolution date",
      error: err,
    });
  }
};

// 1️⃣ Get complaints assigned to logged in worker
export const getAssignedComplaints = async (req, res) => {
  console.log("outside try block assigned complaints route");
  try {
    console.log("Inside assigned complaints route");
    console.log("req.user", req.user);
    const complaints = await Complaint.find({ assignedTo: req.user.id })
      .populate("user", "name phone email")
      .sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch assigned complaints",
        error: err,
      });
  }
};

// 2️⃣ Mark complaint as in progress
export const startComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found or not assigned to you",
      });
    }

    complaint.status = "in_progress";
    await complaint.save();

    res.json({ message: "Complaint marked as in progress", complaint });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update complaint", error: err });
  }
};

// 3️⃣ Resolve complaint with proof photo
export const resolveComplaint = async (req, res) => {
  try {
    const { proofPhotoUrl } = req.body;

    if (!proofPhotoUrl) {
      return res
        .status(400)
        .json({ message: "Proof photo is required" });
    }

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found or not assigned to you",
      });
    }

    complaint.status = "resolved";
    complaint.proofPhotoUrl = proofPhotoUrl;
    complaint.resolvedAt = new Date();

    await complaint.save();

    res.json({ message: "Complaint resolved successfully", complaint });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to resolve complaint", error: err });
  }
};

// 4️⃣ Worker performance stats
export const getPerformance = async (req, res) => {
  try {
    console.log("Inside performance route");
    console.log("req.user", req.user);
    const totalAssigned = await Complaint.countDocuments({
      assignedTo: req.user.id,
    });
    const resolved = await Complaint.countDocuments({
      assignedTo: req.user.id,
      status: "resolved",
    });
    const inProgress = await Complaint.countDocuments({
      assignedTo: req.user.id,
      status: "in_progress",
    });

    res.json({
      totalAssigned,
      resolved,
      inProgress,
      completionRate:
        totalAssigned > 0
          ? ((resolved / totalAssigned) * 100).toFixed(2) + "%"
          : "0%",
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch performance stats",
        error: err,
      });
  }
};


