// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, default: "Default Subject" },
  message: { type: String, default: "This is a default message." },
  name: { type: String, default: "Your Company" },
  template: { type: String, default: "default" }, // e.g., "taskCreated", "default"
  status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

let  NotificationSchema= mongoose.model("Notification", notificationSchema);
export default NotificationSchema;