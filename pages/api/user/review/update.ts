import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

interface Request {
  rating: number,
  albumId: string,
  authorId: string
}


export default async (req: NextApiRequest, res: NextApiResponse) => {

  const userData = JSON.parse(req.body) as Request;

  const rating = await prisma.review.update({
    where: {
      albumId_authorId: {
        albumId: userData.albumId,
        authorId: userData.authorId 
      },
    },
    data: {
      rating: userData.rating
    }
  })

  if (rating) {
    res.status(200).json(rating);
  } else {
    res.status(204).end();
  }
};