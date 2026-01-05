import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  status: { type: String, default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"] },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Task", taskSchema);
