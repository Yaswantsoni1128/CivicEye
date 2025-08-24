import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // For OTP login
  email: { type: String, unique: true },
  role: { type: String, enum: ["citizen", "admin", "worker"], default: "citizen" },
  complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
