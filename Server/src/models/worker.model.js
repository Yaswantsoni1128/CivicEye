import mongoose from "mongoose";
import bcrypt from "bcrypt";

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true, minlength: 6 }, 
  assignedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }],
  completedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }],
  performance: {
    tasksCompleted: { type: Number, default: 0 },
    avgResolutionTime: { type: Number, default: 0 } // in hours
  },
  createdAt: { type: Date, default: Date.now }
});

// Static method to hash passwords
workerSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Instance method to compare passwords
workerSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Worker", workerSchema);
