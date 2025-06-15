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

export const editListFn = createServerFn()
  .middleware([protectMiddleware])
  .validator(
    z.object({
      listId: z.string(),
      name: z.string(),
      initialK: z.number(),
      tuningFactor: z.number(),
    }),
  )
  .handler(async ({ context, data }) => {
    const lists = await db
      .update(movieList)
      .set({
        name: data.name,
        initialK: data.initialK,
        tuningFactor: data.tuningFactor,
      })
      .where(
        and(
          eq(movieList.id, data.listId),
          eq(movieList.userId, context.user.id),
        ),
      )
      .returning();

    const list = lists[0];
    if (!list || lists.length === 0) {
      throw new Error("List not found or access denied");
    }

    return list;
  });
