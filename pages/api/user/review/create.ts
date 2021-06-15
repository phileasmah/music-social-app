import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

interface Request {
  albumId: string,
  authorId: string,
  rating: number | null,
  review: string | null,
}


export default async (req: NextApiRequest, res: NextApiResponse) => {

  const userData = JSON.parse(req.body) as Request;
  
  let payload;
  if (userData.rating === null && userData.review === null ) {
    res.status(204).end();
    return;
  };
  if (userData.rating === null) {
    payload = {
      albumId: userData.albumId,
      authorId: userData.authorId,
      review: userData.review
    }
  } else {
    payload = {
      albumId: userData.albumId,
      authorId: userData.authorId,
      rating: userData.rating 
    }
  }

  const rating = await prisma.review.create({
    data: payload
  })

  if (rating) {
    res.status(200).json(rating);
  } else {
    res.status(204).end();
  }
};