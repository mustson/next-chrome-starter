// models/Profile.js

import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userID: {
    type: String,
    unique: true,
    required: true,
  },
  isExtensionUser: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Profile ||
  mongoose.model("Profile", profileSchema);
