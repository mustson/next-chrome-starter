import mongoose from "mongoose";

// You may want to move this connection logic to a separate file or utility if you're going to reuse it
const connectToDb = async () => {
  if (mongoose.connection.readyState === 0) {
    // Check if mongoose is already connected
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      throw new Error("Failed to connect to database");
    }
  }
};

export default async function testConnection(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed, expected GET" });
  }

  try {
    await connectToDb();
    if (mongoose.connection.readyState === 1) {
      // 1 means connected
      return res
        .status(200)
        .json({ message: "Connected to MongoDB successfully!" });
    } else {
      throw new Error("Not connected to database");
    }
  } catch (error) {
    console.error("Error testing connection:", error);
    return res.status(500).json({ error: "Failed to connect to database" });
  }
}
