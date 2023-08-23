// models/Relationship.js

import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema({
  followerID: {
    type: String,
    required: true,
    ref: "Profile",
  },
  followedID: {
    type: String,
    required: true,
    ref: "Profile",
  },
  lastScraped: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Relationship ||
  mongoose.model("Relationship", relationshipSchema);
