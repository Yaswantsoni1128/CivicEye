import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  assignedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }],
  completedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }],
  performance: {
    tasksCompleted: { type: Number, default: 0 },
    avgResolutionTime: { type: Number, default: 0 } // in hours
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Worker", workerSchema);
