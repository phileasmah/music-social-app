import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  
  //Get most recently made reviews
  const userInfo = await prisma.review.findMany({
    take: 4,
    orderBy: {
      createdAt: "asc"
    },
    where:{
      review: {
        not: null
      }
    },
    include: {
      author: {
        select: {
          image: true,
          name: true,
          accounts: {
            select: {
              providerAccountId: true
            }
          }
        }
      }
    }
  });
  
  if (userInfo) {
    res.status(200).json(userInfo);
  } else {
    res.status(204).end();
  }
};