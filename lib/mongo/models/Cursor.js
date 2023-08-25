// models/Cursor.js

import mongoose from "mongoose";

const cursorSchema = new mongoose.Schema({
  screenname: {
    type: String,
    required: true,
    unique: true, // Ensure that each screenname has only one cursor.
  },
  cursor: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Cursor || mongoose.model("Cursor", cursorSchema);
