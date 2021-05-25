import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const encryptedAuth = Buffer.from(
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
  );
  const url =
    "https://accounts.spotify.com/api/token?" +
    new URLSearchParams({
      grant_type: "client_credentials",
    });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + encryptedAuth.toString("base64"),
    },
  });
  const token = await response.json();
  res.status(200).json(token);
};
