import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

interface Request {
  albumId: string,
  authorId: number
}


export default async (req: NextApiRequest, res: NextApiResponse) => {

  const userData = JSON.parse(req.body) as Request;

  const userReview = await prisma.review.findUnique({
    where: {
      albumId_authorId: {
        albumId: userData.albumId,
        authorId: userData.authorId,
      },
    },
  });

  if (userReview) {
    res.status(200).json(userReview);
  } else {
    res.status(204).end();
  }
};
