import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // For OTP login
  email: { type: String, unique: true },
  password: { type: String, required: true, minlength: 6 }, 
  role: { type: String, default: "citizen", immutable: true },
  complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }],
  createdAt: { type: Date, default: Date.now }
});

// Static method to hash passwords
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Instance method to compare passwords
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);

