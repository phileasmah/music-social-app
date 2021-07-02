import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

interface Request {
  userId: string
  otherUserId: string,
  following: boolean
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  
  const { userId, otherUserId, following } = JSON.parse(req.body) as Request
  let status;
  if (following) {
    status = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        following: {
          disconnect: {
            id: otherUserId
          }
        }
      }
    });
  } else {
    status = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        following: {
          connect: {
            id: otherUserId
          }
        }
      }
    });
  }

  if (status) {
    res.status(200).json(status);
  } else {
    res.status(204).end();
  }
};
