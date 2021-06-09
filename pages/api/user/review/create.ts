import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

interface Request {
  rating: number,
  albumId: string,
  authorId: string
}


export default async (req: NextApiRequest, res: NextApiResponse) => {

  const userData = JSON.parse(req.body) as Request;

  const rating = await prisma.review.create({
    data: {
      rating: userData.rating,
      albumId: userData.albumId,
      authorId: userData.authorId
    }
  })

  if (rating) {
    res.status(200).json(rating);
  } else {
    res.status(204).end();
  }
};