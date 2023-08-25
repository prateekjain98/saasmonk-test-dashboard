import { z } from "zod";

//TODO temp duplication, should import from botpress package directly
export const webchatVisibility = z.object({
  type: z.literal("webchat_visibility"),
  visibility: z.union([
    z.literal("show"),
    z.literal("hide"),
    z.literal("toggle"),
  ]),
});

export const webchatConfig = z.object({
  type: z.literal("webchat_config"),
  config: z.record(z.any()),
});

export const customEvent = z.object({
  type: z.literal("custom_event"),
  event: z.record(z.any()),
});

export const bookMeeting = z.object({
  type: z.literal("book_meeting"),
});

export const triggerSchema = z.union([
  webchatVisibility,
  webchatConfig,
  customEvent,
  bookMeeting,
]);

export const baseSchema = z.object({
  className: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const textSchema = baseSchema.extend({
  text: z.string(),
  markdown: z.boolean().optional(),
});

const choiceSchema = z.object({ title: z.string(), value: z.string() });
export type Choice = z.infer<typeof choiceSchema>;

export const singleChoiceSchema = baseSchema.extend({
  text: z.string(),
  disableFreeText: z.boolean().optional(),
  choices: z.array(choiceSchema),
  options: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
});

export const outgoingMessageSchema = z.union([
  textSchema.extend({ type: z.literal("text") }),
  singleChoiceSchema.extend({ type: z.literal("single-choice") }),
  z.object({ type: z.literal("trigger"), trigger: triggerSchema }),
]);

export const botpressResponseBody = z.object({
  conversationId: z.string(),
  message: outgoingMessageSchema,
});

export const chatCreateBody = z.object({
  conversationId: z.string(),
  message: z.string(),
  senderId: z.string(),
  isHumanInConversation: z.boolean().optional(),
  type: z.enum(["text", "action"]),
});

export type BotpressResponseBody = z.infer<typeof botpressResponseBody>;

export type ChatCreateBody = z.infer<typeof chatCreateBody>;
