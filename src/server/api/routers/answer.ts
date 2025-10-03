import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const answerRouter = createTRPCRouter({
  createAnswer: protectedProcedure
    .input(
      z.object({
        body: z.string().max(1000).min(1),
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const newAnswer = await db.answer.create({
        data: {
          body: input.body,
          userId: session.user.id,
          postId: input.postId,
        },
      });

      return newAnswer;
    }),

  getAnswersByPostId: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const answers = await db.answer.findMany({
        where: {
          postId: input.postId,
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          author: {
            select: {
              username: true,
              image: true,
            },
          },
        },
      });
      return answers;
    }),
});
