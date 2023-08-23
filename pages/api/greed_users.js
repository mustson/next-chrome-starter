import { connectToDatabase } from "../../lib/mongo/mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, expected POST" });
  }

  let db;
  try {
    db = await connectToDatabase();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Error while trying to establish connection" });
  }

  if (db) {
    res.json({ message: "Success" });
  } else {
    res.status(500).json({ error: "Failed to connect to the database" });
  }
}
