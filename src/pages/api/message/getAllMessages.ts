import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { prisma } from "~/server/db";
import { conversationIdSchema } from "~/zod/trpc/message";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "POST", "HEAD"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  try {
    const conversationId = conversationIdSchema.parse(req.query.conversationId);

    const messages = await prisma.message.findMany({
      where: {
        conversation_id: conversationId,
      },
      orderBy: {
        timestamp: "asc",
      },
      take: 50,
    });

    return res.status(200).send({
      message: "messages retrieved successfully",
      messages,
    });
  } catch (error) {
    console.error(error);
    // ! todo need the error handling function
    return res.status(500).send({
      message: "something went wrong",
    });
  }
}
