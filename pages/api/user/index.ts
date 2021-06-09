import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

interface Request {
  authorId: number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  
  const userData = JSON.parse(req.body) as Request;

  const userInfo = await prisma.user.findUnique({
    where: {
      id: userData.authorId
    },
    select: {
      name: true,
      image: true
    }
  });

  if (userInfo) {
    res.status(200).json(userInfo);
  } else {
    res.status(204).end();
  }
};
