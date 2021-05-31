import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { id } = req.query;
  const reviews = await prisma.review.findMany({
    where: {
      albumId: id as string,
    },
  });
  const average = await prisma.review.aggregate({
    take: 3,
    avg: {
      rating: true,
    },
    count: {
      rating: true,
    },
    where: {
      albumId: id as string,
    },
  });

  Promise.all([reviews, average]).then(
    (results) => {
      if (results[1].count.rating !== 0) {
        res.status(200).json(results);
      } else {
        res.status(204).end();
      }
    },
    (err) => {
      console.log(err);
      res.status(405).end();
    }
  );
};