import { connectToDatabase } from "../../lib/mongo/mongodb.js";
import Job from "../../lib/mongo/models/Job";
import Relationship from "../../lib/mongo/models/Relationship";
import FollowerHistory from "../../lib/mongo/models/FollowerHistory";

export default async function processFollowerData(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, expected POST" });
  }

  const screenname = req.body.screenname;
  if (!screenname) {
    return res
      .status(400)
      .json({ error: "screenname is required in the request body" });
  }

  // Fetch the latest job for the given screenname
  const job = await Job.findOne({ screenname }).sort({ timestamp: -1 });
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const currentFollowersFromAPI = job.followers;
  const relationships = await Relationship.find({ followedID: screenname });
  const currentFollowersFromDB = relationships.map((rel) => rel.followerID);

  let newFollowers = [];
  let unfollowers = [];

  if (relationships.length === 0) {
    newFollowers = currentFollowersFromAPI;
  } else {
    newFollowers = currentFollowersFromAPI.filter(
      (f) => !currentFollowersFromDB.includes(f)
    );
    unfollowers = currentFollowersFromDB.filter(
      (f) => !currentFollowersFromAPI.includes(f)
    );
  }

  // Update Relationship
  // Remove unfollowers
  await Relationship.deleteMany({
    followedID: screenname,
    followerID: { $in: unfollowers },
  });

  // Add new followers to Relationships
  const newFollowerDocs = newFollowers.map((follower) => ({
    followedID: screenname,
    followerID: follower.user_id,
  }));

  await Relationship.insertMany(newFollowerDocs);

  // Add actions to FollowerHistory
  const newFollowerHistoryDocs = newFollowers.map((follower) => ({
    user: screenname,
    follower: follower.user_id,
    action: "follow",
  }));

  await FollowerHistory.insertMany(newFollowerHistoryDocs);

  const unfollowerHistoryDocs = unfollowers.map((followerID) => ({
    user: screenname,
    follower: followerID,
    action: "unfollow",
  }));

  await FollowerHistory.insertMany(unfollowerHistoryDocs);

  res.status(200).json({
    message: "Relationship and follower history data processed successfully.",
    newFollowers,
    unfollowers,
  });
}
