import { connectToDatabase } from "../../lib/mongo/mongodb.js";
import Job from "../../lib/mongo/models/Job";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed, expected GET" });
  }

  // Connect to the database or fail early
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Database connection error:", error.message);
    return res.status(500).json({ error: "Failed to connect to the database" });
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

  const getFollowerCount = async () => {
    const url = `https://twitter-api45.p.rapidapi.com/screenname.php?screenname=${screenname}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.sub_count; // Extract sub_count from the response
  };

  let cursor = null;
  const allFollowers = [];
  let attemptCount = 0;

  while (attemptCount < 3) {
    try {
      // 1. Get follower count before fetching details
      const initialCount = await getFollowerCount();
      console.log(`Initial follower count: ${initialCount}`);

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

        allFollowers.push(...currentFollowers);
        cursor = data.next_cursor;
      } while (cursor);

      // 3. Get follower count after fetching details
      const finalCount = await getFollowerCount();
      console.log(`Final follower count: ${finalCount}`);
      console.log(`Followers fetched in detail: ${allFollowers.length}`);

      if (initialCount === finalCount && finalCount === allFollowers.length) {
        console.log("Follower data consistent. Creating job...");
        const job = new Job({
          screenname,
          status: "queued",
          followers: allFollowers,
          timestamp: new Date(),
        });
        await job.save();

        res.status(200).json({
          message: "All follower data fetched and job saved successfully.",
          jobId: job._id,
          fetchedCount: allFollowers.length,
        });
        return;
      } else {
        console.log("Follower data inconsistent. Retrying...");
        allFollowers.length = 0; // reset the allFollowers array
      }

      await new Promise((resolve) => setTimeout(resolve, 20000)); // Pause for 20 seconds
      attemptCount++;
    } catch (error) {
      console.error("Error fetching followers:", error);
      attemptCount++;
    }
  }

  // If after 3 attempts the data is still inconsistent
  console.log("Failed after 3 attempts. Sending error response.");
  res.status(500).json({
    error: "Could not guarantee follower consistency. Try again later.",
  });
}
