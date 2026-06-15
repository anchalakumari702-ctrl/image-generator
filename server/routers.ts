import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  images: router({
    generate: protectedProcedure
      .input(
        z.object({
          prompt: z.string().min(3).max(1000),
          style: z.string().default("realistic"),
          aspectRatio: z.string().default("1:1"),
          imageCount: z.number().min(1).max(4).default(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const { generateImage } = await import("./_core/imageGeneration");
          const { createGeneratedImage } = await import("./db");

          const response = await generateImage({
            prompt: input.prompt,
          });
          const imageUrl = response.url;

          if (!imageUrl) {
            throw new Error("Image generation returned no URL");
          }

          const generationId = `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const imageKey = `${ctx.user.id}/generated/${generationId}.png`;

          // Store the image URL reference in database
          await createGeneratedImage(
            ctx.user.id,
            input.prompt,
            input.style,
            input.aspectRatio,
            imageUrl,
            imageKey,
            generationId
          );

          return {
            success: true,
            imageUrl,
            generationId,
          };
        } catch (error) {
          console.error("Image generation error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate image. Please try again.",
          });
        }
      }),

    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        const { getGeneratedImagesByUserId } = await import("./db");
        const images = await getGeneratedImagesByUserId(
          ctx.user.id,
          input.limit,
          input.offset
        );
        return images;
      }),

    delete: protectedProcedure
      .input(z.object({ imageId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        try {
          const { deleteGeneratedImage } = await import("./db");
          await deleteGeneratedImage(input.imageId, ctx.user.id);
          return { success: true };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete image",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
