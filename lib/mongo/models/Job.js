// Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  screenname: { type: String, required: true },
  status: {
    type: String,
    enum: ["started", "queued", "processed", "pending", "error", "completed"],
    required: true,
  },
  followers: { type: Array, default: [] }, // Store the aggregated followers here
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
