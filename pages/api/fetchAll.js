import { connectToDatabase } from "../../lib/mongo/mongodb.js";

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

  let cursor = null;
  const allFollowers = []; // Aggregate all followers here

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

      allFollowers.push(...currentFollowers); // Add the current batch of followers to the aggregate

      cursor = data.next_cursor;

      // Optional: Introduce a delay if needed to prevent hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    } while (cursor);

    // By the time we reach here, we've fetched all pages of followers.
    res.status(200).json({
      message: "All follower data fetched successfully.",
      followers: allFollowers, // This will send all followers in the response. If the list is very large, consider not sending this.
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
