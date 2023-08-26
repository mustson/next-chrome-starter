import { connectToDatabase } from "../../lib/mongo/mongodb.js";
import Job from "../../lib/mongo/models/Job";
import Relationship from "../../lib/mongo/models/Relationship";
import FollowerHistory from "../../lib/mongo/models/FollowerHistory";

export default async function processFollowerData(req, res) {
  console.log("Starting processFollowerData");

  if (req.method !== "POST") {
    console.log("Error: Method not POST");
    return res.status(405).json({ error: "Method not allowed, expected POST" });
  }

  console.log("Connecting to database");
  const dbConnection = await connectToDatabase();

  if (!dbConnection.isConnected) {
    console.log("Error: Failed to connect to database");
    return res.status(500).json({ error: "Failed to connect to database" });
  }

  console.log("Fetching oldest queued job");
  const job = await Job.findOne({ status: "queued" }).sort({ timestamp: 1 });

  if (!job) {
    console.log("Error: No queued jobs found");
    return res.status(404).json({ error: "No queued jobs found" });
  }

  console.log(`Processing job for screenname: ${job.screenname}`);
  const screenname = job.screenname;

  const currentFollowersFromAPI = job.followers.map((f) => f.user_id);
  const relationships = await Relationship.find({ followedID: screenname });
  const currentFollowersFromDB = relationships.map((rel) => rel.followerID);

  const newFollowers = currentFollowersFromAPI.filter(
    (f) => !currentFollowersFromDB.includes(f)
  );
  const unfollowers = currentFollowersFromDB.filter(
    (f) => !currentFollowersFromAPI.includes(f)
  );

  console.log("Inserting new relationships to DB");
  await Relationship.insertMany(
    newFollowers.map((followerID) => ({
      followedID: screenname,
      followerID,
      lastScraped: job.timestamp,
    }))
  );

  console.log("Deleting unfollowed relationships from DB");
  await Relationship.deleteMany({
    followedID: screenname,
    followerID: { $in: unfollowers },
  });

  console.log("Updating follower history");
  const followerHistoryDocs = [
    ...newFollowers.map((followerID) => ({
      user: screenname,
      follower: followerID,
      action: "follow",
      timestamp: job.timestamp,
    })),
    ...unfollowers.map((followerID) => ({
      user: screenname,
      follower: followerID,
      action: "unfollow",
      timestamp: job.timestamp,
    })),
  ];

  for (let doc of followerHistoryDocs) {
    await FollowerHistory.findOneAndUpdate(
      { user: doc.user, follower: doc.follower, action: doc.action },
      doc,
      { upsert: true }
    );
  }

  console.log("Updating job status to processed");
  await Job.findByIdAndUpdate(job._id, { status: "processed" });

  console.log("Process completed successfully");
  res.status(200).json({
    message: "Relationship and Follower History data processed successfully.",
    newFollowers,
    unfollowers,
  });
}
