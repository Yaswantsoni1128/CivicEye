import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
  type: { type: String, enum: ["sms", "email", "whatsapp"] },
  message: { type: String, required: true },
  status: { type: String, enum: ["sent", "failed"], default: "sent" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
