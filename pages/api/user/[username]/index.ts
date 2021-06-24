import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const username = req.query.username as string;

  const userInfo = await prisma.user.findMany({
    where: {
      accounts: {
        some: {
          providerAccountId: username,
        },
      },
    },
    select: {
      name: true,
      image: true,
      id: true,
      reviews: true
    },
  });

  if (userInfo.length !== 0) {
    res.status(200).json(userInfo);
  } else {
    res.status(204).end();
  }
};
