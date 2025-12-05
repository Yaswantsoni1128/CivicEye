import Complaint from "../models/complaint.model.js";
import Worker from "../models/worker.model.js";
import { analyzeComplaintImage } from "../services/genAI.js";

// Create complaint (citizen)
export const createComplaint = async (req, res) => {
  try {
    const { photoUrl, description, location, title } = req.body;
    if (!photoUrl || !location?.coordinates) {
      return res
        .status(400)
        .json({ message: "Photo and location are required" });
    }

    const { type, priority } = await analyzeComplaintImage(photoUrl);

    const complaint = await Complaint.create({
      user: req.user.id,
      photoUrl,
      description,
      location,
      type,
      priority,
      title,
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
};

// Get complaints of logged-in citizen
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .populate("assignedTo", "name phone email")
      .sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch complaints", error: err });
  }
};

// Get single complaint
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("assignedTo", "name phone email");

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    res.json({ complaint });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch complaint", error: err });
  }
};

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });
    if (complaint.status !== "resolved") {
      return res.status(400).json({
        message: "Can only give feedback on resolved complaints",
      });
    }

    complaint.feedback = feedback;
    await complaint.save();

    res.json({ message: "Feedback submitted", complaint });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to submit feedback", error: err });
  }
};

// Submit rating for resolved complaint
export const submitRating = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.status !== "resolved") {
      return res.status(400).json({
        message: "Can only rate resolved complaints",
      });
    }

    if (complaint.rating) {
      return res.status(400).json({
        message: "You have already rated this complaint",
      });
    }

    // Update complaint rating
    complaint.rating = rating;
    await complaint.save();

    // Update worker's average rating if complaint is assigned
    if (complaint.assignedTo) {
      const worker = await Worker.findById(complaint.assignedTo);
      if (worker) {
        // Get all resolved complaints with ratings for this worker
        const ratedComplaints = await Complaint.find({
          assignedTo: worker._id,
          status: "resolved",
          rating: { $ne: null },
        });

        const totalRatings = ratedComplaints.length;
        const sumRatings = ratedComplaints.reduce(
          (sum, c) => sum + (c.rating || 0),
          0
        );

        worker.totalRatings = totalRatings;
        worker.averageRating =
          totalRatings > 0 ? sumRatings / totalRatings : 0;
        await worker.save();
      }
    }

    res.json({
      message: "Rating submitted successfully",
      complaint,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to submit rating",
      error: err.message || err,
    });
  }
};


