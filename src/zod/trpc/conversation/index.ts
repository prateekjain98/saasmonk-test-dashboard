import { z } from "zod";

export const getConversationSchema = z.string();
export const getConversationsSchema = z.object({
  agentId: z.string().optional(),
});
