import {
  and,
  eq,
  movieList,
  movieListComparisonHistory,
  movieListItem,
} from "@repo/database";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "~/lib/db";
import { protectMiddleware } from "~/lib/middleware/auth";

export const addListItemFn = createServerFn()
  .middleware([protectMiddleware])
  .validator(z.object({ tmdbid: z.string(), listId: z.string() }))
  .handler(async ({ context, data }) => {
    await db.insert(movieListItem).values({
      tmdbId: data.tmdbid,

      movieListId: data.listId,

      userId: context.user.id,
    });
  });

export const resetEloFn = createServerFn()
  .middleware([protectMiddleware])
  .validator(z.object({ listId: z.string() }))
  .handler(async ({ context, data }) => {
    // check user can access list
    const list = await db.query.movieList.findFirst({
      where: and(
        eq(movieList.id, data.listId),
        eq(movieList.userId, context.user.id),
      ),
    });
    if (!list) {
      throw new Error("List not found or access denied");
    }
    await db.transaction(async (tx) => {
      await tx
        .update(movieListItem)
        .set({ currentElo: 1500 })
        .where(eq(movieListItem.movieListId, data.listId));

      await tx
        .delete(movieListComparisonHistory)
        .where(eq(movieListComparisonHistory.movieListId, data.listId));
    });
  });
