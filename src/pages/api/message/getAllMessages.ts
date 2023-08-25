import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { conversationIdSchema } from "~/zod/trpc/message";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
