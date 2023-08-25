import mongoose from "mongoose";
import Relationship from "../../lib/mongo/models/Relationship";
import { connectToDatabase } from "../../lib/mongo/mongodb.js";
import {
  getLastProcessedCursorFor,
  storeLastProcessedCursorFor,
} from "../../lib/utils/cursorHandlers.js"; // Replace `yourUtilFileName` with the actual utility file name.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed, expected GET" });
  }

  const screenname = req.query.screenname;
  if (!screenname) {
    return res.status(400).json({ error: "screenname is required" });
  }

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": "twitter-api45.p.rapidapi.com",
    },
  };

  //let cursor = (await getLastProcessedCursorFor(screenname)) || null;
  let cursor = null;

  try {
    do {
      let url = `https://twitter-api45.p.rapidapi.com/followers.php?screenname=${screenname}`;
      if (cursor) {
        url += `&cursor=${cursor}`;
      }

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const currentFollowers = data.followers;

      // Save the current batch of followers to the database
      for (const follower of currentFollowers) {
        const existingRelationship = await Relationship.findOne({
          followerID: follower.user_id,
          followedID: screenname,
        });

        if (!existingRelationship) {
          const relationship = new Relationship({
            followerID: follower.user_id,
            followedID: screenname,
          });
          await relationship.save();
        }
      }

      console.log("Next Cursor Value: ", data.next_cursor);

      cursor = data.next_cursor;

      // Store the last processed cursor for this screenname
      console.log("Next Cursor Value: ", data.next_cursor);
      await storeLastProcessedCursorFor(screenname, cursor);

      // Optional: Introduce a delay if needed to prevent hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    } while (cursor);

    res.status(200).send({ message: "All follower data fetched and logged." });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
