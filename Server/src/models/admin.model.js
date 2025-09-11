import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true, minlength: 6 }, 
  phone: { type: String, unique: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  managedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }],
  createdAt: { type: Date, default: Date.now }
});

// Static method to hash passwords
adminSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Instance method to compare passwords
adminSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Admin", adminSchema);
