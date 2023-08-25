import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { createConversationParticipantSchema } from "~/zod/trpc/conversationParticipant";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await NextCors(req, res, {
      methods: ["POST", "HEAD"],
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    if (req.method !== "POST") {
      return res.status(405).send({
        message: "method not allowed",
      });
    }

    const { conversationId, userId } =
      createConversationParticipantSchema.parse(req.body);
    const conversationParticipant = await prisma.conversationParticipant.create(
      {
        data: { user_id: userId, conversation_id: conversationId },
      }
    );

    return res.status(200).send({
      message: "Participant created successfully",
      conversationParticipant,
    });
  } catch (error) {
    console.error(error);
    // ! todo need the error handling function
    return res.status(500).send({
      message: "something went wrong",
    });
  }
}
