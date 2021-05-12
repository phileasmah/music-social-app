import prisma from "../../lib/prisma";



export default async (req, res) => {

  const parsed = JSON.parse(req.body)
  console.log(parsed.email);
  const updateCount = await prisma.user.update({
    where:{
      email: parsed.email
    },
    data: {
      count: {
        increment: 1
      }
    }
  })
  res.json(updateCount);
}