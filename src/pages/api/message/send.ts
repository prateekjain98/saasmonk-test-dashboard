import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { chatCreateBody } from "~/zod/botpressWebhook";
import NextCors from "nextjs-cors";

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
    const body = chatCreateBody.parse(req.body);

    const message = await prisma.message.create({
      data: {
        conversation_id: body.conversationId,
        sender_id: body.senderId,
        message: body.message,
        is_human_in_conversation: body.isHumanInConversation,
      },
    });

    return res.status(200).send({
      message,
    });
  } catch (error) {
    console.error(error);
    // ! todo need the error handling function
    return res.status(500).send({
      message: "something went wrong",
    });
  }
}
