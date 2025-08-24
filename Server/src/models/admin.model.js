import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  managedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Admin", adminSchema);
