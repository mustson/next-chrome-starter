// models/FollowerHistory.js

import mongoose from "mongoose";

const FollowerHistorySchema = new mongoose.Schema({
  user: {
    // User who is being followed or unfollowed
    type: String,
    required: true,
    ref: "Profile",
  },
  follower: {
    // User who did the action (follow/unfollow)
    type: String,
    required: true,
    ref: "Profile",
  },
  action: {
    type: String, // 'follow' or 'unfollow'
    required: true,
    enum: ["follow", "unfollow"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.FollowerHistory ||
  mongoose.model("FollowerHistory", FollowerHistorySchema);
