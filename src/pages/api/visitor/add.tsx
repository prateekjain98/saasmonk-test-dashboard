import { Formidable } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "~/server/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const form = new Formidable();
  try {
    const data = await form.parse(req);
    const { visitor_id } = data[0];

    //check if visitor exists
    const visitor = await prisma.visitor.findUnique({
      where: {
        id: visitor_id ? visitor_id[0] : "",
      },
    });
    if (!visitor) {
      await prisma.visitor.create({
        data: {
          id: visitor_id ? visitor_id[0] : "",
        },
      });
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send({
      message: "Event saved",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error saving event" });
  }
}
