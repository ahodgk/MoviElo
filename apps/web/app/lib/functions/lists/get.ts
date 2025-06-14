import {
  and,
  count,
  desc,
  eq,
  movieList,
  movieListComparisonHistory,
  movieListItem,
  or,
} from "@repo/database";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "~/lib/db";
import { protectMiddleware } from "~/lib/middleware/auth";

export const getLists = createServerFn()
  .middleware([protectMiddleware])
  .handler(async ({ context }) => {
    const user = context.user;

    const lists = await db
      .select()
      .from(movieList)
      .where(eq(movieList.userId, user.id))
      .orderBy(desc(movieList.updatedAt));

    return lists;
  });

export const getListDetails = createServerFn()
  .middleware([protectMiddleware])
  .validator(z.object({ listId: z.string() }))
  .handler(async ({ context, data }) => {
    const list = await db.query.movieList.findFirst({
      where: and(
        eq(movieList.userId, context.user.id),
        eq(movieList.id, data.listId),
      ),
      with: {
        items: true,
        // comparisonHistory: true, // will be separate so can be paginated
      },
    });
    // logger.debug(list, `Fetched list details, ${list?.id}`);
    return { list };
  });

export const getListItemsFn = createServerFn()
  .middleware([protectMiddleware])
  .validator(z.object({ listId: z.string() }))
  .handler(async ({ context, data }) => {
    const items = await db
      .select({
        elo: movieListItem.currentElo,
        tmdbId: movieListItem.tmdbId,
        count: count(movieListComparisonHistory.id),
      })
      .from(movieListItem)

      .leftJoin(movieList, eq(movieList.id, movieListItem.movieListId))

      .leftJoin(
        movieListComparisonHistory,
        and(
          eq(movieListComparisonHistory.movieListId, movieListItem.movieListId),
          or(
            eq(
              movieListComparisonHistory.winningMovieListItemId,
              movieListItem.tmdbId,
            ),
            eq(
              movieListComparisonHistory.losingMovieListItemId,
              movieListItem.tmdbId,
            ),
          ),
        ),
      )

      .groupBy(
        movieListItem.tmdbId,
        movieListItem.movieListId,
        movieListItem.currentElo,
      )
      .orderBy(desc(count(movieListComparisonHistory.id)))

      .where(
        and(
          eq(movieList.userId, context.user.id),
          eq(movieListItem.movieListId, data.listId),
        ),
      );

    return items;
  });

export const getComparisonHistoryFn = createServerFn()
  .middleware([protectMiddleware])
  .validator(z.object({ listId: z.string() }))
  .handler(async ({ context, data }) => {
    const history = await db
      .select()
      .from(movieListComparisonHistory)
      .leftJoin(
        movieList,
        eq(movieList.id, movieListComparisonHistory.movieListId),
      )
      .where(
        and(
          eq(movieListComparisonHistory.movieListId, data.listId),
          eq(movieList.userId, context.user.id),
        ),
      )
      .orderBy(desc(movieListComparisonHistory.createdAt));

    return history.map((item) => item.movie_list_comparison_history);
  });
