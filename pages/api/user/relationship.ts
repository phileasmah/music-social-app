import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

//function that shows whether the user is following and followed by the
//other user

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const username = req.body.username as string;
  const otherUser = req.body.otherUser as string;
  const userInfo = await prisma.user.findMany({
    select: {
      followers: {
        where:{
          followingId: username
        }
      }, 
      following: {
        where:{
          followerId: username
        }
      }
    },
    where: {
      accounts: {
        some: {
          providerAccountId: otherUser
        }
      }
    },
  });
  if (userInfo.length !== 0) {
    res.status(200).json(userInfo);
  } else {
    res.status(204).end();
  }
};
