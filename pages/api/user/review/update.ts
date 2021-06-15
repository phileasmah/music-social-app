import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

interface Request {
  albumId: string;
  authorId: string;
  rating: number | null;
  review: string | null;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const userData = JSON.parse(req.body) as Request;

  let updatedData;
  if (userData.rating === null && userData.review === null) {
    res.status(204).end();
    return;
  }
  if (userData.rating === null) {
    if (userData.review === "") {
      console.log("yes")
      updatedData = {
        review: null,
      };
    } else {
      console.log("no")
      updatedData = {
        review: userData.review,
      };
    }
  } else {
    updatedData = {
      rating: userData.rating,
    };
  }

  const rating = await prisma.review.update({
    where: {
      albumId_authorId: {
        albumId: userData.albumId,
        authorId: userData.authorId,
      },
    },
    data: updatedData,
  });

  if (rating) {
    res.status(200).json(rating);
  } else {
    res.status(204).end();
  }
};
