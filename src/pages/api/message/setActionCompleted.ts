import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { prisma } from "~/server/db";
import { conversationIdSchema } from "~/zod/trpc/message";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "POST", "HEAD", "PUT"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  try {
    const messageId = conversationIdSchema.parse(req.body.messageId);

    const messages = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        action_completed: true,
      },
    });

    return res.status(200).send({
      message: "Message action_completed marked true successfully",
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
