import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

interface Request {
  userId: string;
  otherUserId: string;
  following: boolean;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const { userId, otherUserId, following } = JSON.parse(req.body) as Request;
  let status;
  if (following) {
    status = await prisma.follows.delete({
      where: {
        followerId_followingId: {followerId:otherUserId, followingId:userId} 
      },
    });
  } else {
    status = await prisma.follows.create({
      data: {
        followerId: otherUserId,
        followingId: userId,
      },
    });
  }

  if (status) {
    res.status(200).json(status);
  } else {
    res.status(204).end();
  }
};
