import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

interface Request {
  id: string;
  newName: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const userData = JSON.parse(req.body) as Request;

  const changeUsername = await prisma.user.update({
    where: {
      id: userData.id
    },
    data: {
      name: userData.newName
    }
  });

  if (changeUsername) {
    res.status(200).json(changeUsername);
  } else {
    res.status(204).end();
  }
};
