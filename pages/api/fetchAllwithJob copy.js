import { connectToDatabase } from "../../lib/mongo/mongodb.js";
import Job from "../../lib/mongo/models/Job";

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

  // Step 2: Create a new Job entry
  const job = new Job({ screenname, status: "started" });
  await job.save();
  console.log("Job created", job);

  let cursor = null;
  const allFollowers = [];

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

      allFollowers.push(...currentFollowers);

      cursor = data.next_cursor;

      /*  await new Promise((resolve) => setTimeout(resolve, 100)); */
    } while (cursor);

    // Step 4: Update the job entry
    job.status = "queued";
    job.followers = allFollowers;
    job.timestamp = new Date();
    await job.save();

    // Step 5: Send the 200 response
    res.status(200).json({
      message: "All follower data fetched and job saved successfully.",
      jobId: job._id,
    });
  } catch (error) {
    // Error handling: Update the job status to reflect that there was an error, if necessary.
    console.error("Error fetching followers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
