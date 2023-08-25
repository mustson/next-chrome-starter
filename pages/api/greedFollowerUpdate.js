import { connectToDatabase } from "../../lib/mongo/mongodb.js";
import fs from "fs";
import path from "path";

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
  let allFollowers = [];

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
      allFollowers = allFollowers.concat(data.followers);

      cursor = data.next_cursor;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (cursor);

    // Write to a file
    const filePath = path.join(process.cwd(), "followers_dump.json");
    fs.writeFileSync(filePath, JSON.stringify(allFollowers, null, 4));

    res
      .status(200)
      .send({
        message: "All follower data fetched and logged to followers_dump.json.",
      });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
