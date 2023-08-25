import mongoose from "mongoose";

const followerStatisticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  followerCount: {
    type: Number,
    required: true,
  },
  gainedFollowers: {
    type: [String],
    default: [],
  },
  lostFollowers: {
    type: [String],
    default: [],
  },
});

// Compound index for date and userID to ensure one entry per user per day and to speed up queries
followerStatisticsSchema.index({ date: 1, userID: 1 }, { unique: true });

export default mongoose.models.FollowerStatistics ||
  mongoose.model("FollowerStatistics", followerStatisticsSchema);
