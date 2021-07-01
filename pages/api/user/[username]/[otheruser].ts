import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const username = req.query.username as string;
  const otherUser = req.query.otheruser as string;

  const userInfo = await prisma.user.findMany({
    select: {
      followedBy: {
        select: {
          name: true,
        },
        where: {
          accounts: {
            some: {
              providerAccountId: otherUser,
            },
          },
        },
      },
      following: {
        select: {
          name: true,
        },
        where: {
          accounts: {
            some: {
              providerAccountId: otherUser,
            },
          },
        },
      },
    },
    where: {
      accounts: {
        some: {
          providerAccountId: username,
        },
      },
    },
  });

  if (userInfo.length !== 0) {
    res.status(200).json(userInfo);
  } else {
    res.status(204).end();
  }
};
