import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

interface Request {
  userId: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const { userId } = JSON.parse(req.body) as Request;
  const status = await prisma.user.findUnique({
    select:{
      image: true,
      name: true,
      accounts: {
        select: {
          providerAccountId: true  
        }
      },
      _count: {
        select: {
          followers: true,
          following: true
        }
      }
    },
    where: {
      id: userId
    }
  })
  if (status) {
    res.status(200).json(status);
  } else {
    res.status(204).end();
  }
};
