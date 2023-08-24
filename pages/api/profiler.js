import { connectToDatabase } from "../../lib/mongo/mongodb";
import Profile from "../../lib/mongo/models/profile";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      let { userID, isExtensionUser } = req.body;

      if (typeof userID !== "string" || typeof isExtensionUser !== "boolean") {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }

      // Ensure MongoDB connection
      await connectToDatabase();

      // Create the profile object
      const profile = { userID, isExtensionUser };

      try {
        // Try finding the profile
        const existingProfile = await Profile.findOne({
          userID: profile.userID,
        });

        // If a profile is found
        if (existingProfile) {
          // If 'isExtensionUser' is being changed to true, update the profile
          if (!existingProfile.isExtensionUser && profile.isExtensionUser) {
            await Profile.findOneAndUpdate({ userID: profile.userID }, profile);
            res.status(200).json({ status: "Profile updated." });
          } else {
            res.status(200).json({ status: "No update needed." });
          }
        }
        // If no profile is found
        else {
          await new Profile(profile).save();
          res.status(200).json({ status: "Profile created." });
        }
      } catch (error) {
        // If an error occurs during database operation
        res.status(500).json({
          error: "An error occurred while processing the profile",
          details: error.message,
        });
      }
      break;
    default:
      res.status(405).end(); // Method not allowed
      break;
  }
}
