// Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  screenname: { type: String, required: true },
  status: { type: String, enum: ["started", "completed"], required: true },
  followers: { type: Array, default: [] }, // Store the aggregated followers here
  timestamp: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", JobSchema);

export default Job;
