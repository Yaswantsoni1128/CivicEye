import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  photoUrl: { type: String, required: true }, // Cloudinary/Firebase URL
  description: { type: String },
  type: { type: String, enum: ["garbage", "pothole", "water_leak", "streetlight", "other"], default: "other" },
  status: { type: String, enum: ["received", "in_progress", "resolved"], default: "received" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
  priority: { type: Number, default: 0 }, // AI sets priority
  proofPhotoUrl: { type: String }, // Worker uploads after resolving
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

complaintSchema.index({ location: "2dsphere" });

export default mongoose.model("Complaint", complaintSchema);
