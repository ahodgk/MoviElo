import {
  and,
  count,
  eq,
  movieList,
  movieListComparisonHistory,
  movieListItem,
  or,
} from "@repo/database";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "../db";
import { logger } from "../logger";
import { protectMiddleware } from "../middleware/auth";
import { adjustElo } from "../utils/elo";

export const compareMovieFn = createServerFn()
  .middleware([protectMiddleware])
  .validator(
    z.object({
      winningMovieListItemId: z.string(),
      losingMovieListItemId: z.string(),
      winFirst: z.boolean().optional(),
      movieListId: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    logger.debug(
      `Comparing movies: ${data.winningMovieListItemId} vs ${data.losingMovieListItemId}`,
    );

    const winningMovieItemPromise = getItemEloData(
      data.movieListId,
      data.winningMovieListItemId,
    );
    const losingMovieItemPromise = getItemEloData(
      data.movieListId,
      data.losingMovieListItemId,
    );

    // check user can access list
    const list = await db.query.movieList.findFirst({
      where: and(
        eq(movieList.id, data.movieListId),
        eq(movieList.userId, context.user.id),
      ),
    });
    if (!list) {
      throw new Error("List not found or access denied");
    }
    logger.debug("valid list");

    const winningMovieItem = await winningMovieItemPromise;
    const losingMovieItem = await losingMovieItemPromise;

    logger.debug("get list item data");

    if (winningMovieItem.length === 0 || losingMovieItem.length === 0) {
      throw new Error("One or both movies not found in the list");
    }

    const expectedScore_winning =
      1 /
      (1 + 10 ** ((losingMovieItem[0].elo - winningMovieItem[0].elo) / 400));
    const expectedScore_losing =
      1 /
      (1 + 10 ** ((winningMovieItem[0].elo - losingMovieItem[0].elo) / 400));

    const winnerElo = adjustElo(
      winningMovieItem[0].elo,
      expectedScore_winning,
      1,
      list.initialK,
      winningMovieItem[0].count,
      list.tuningFactor,
    );

    const loserElo = adjustElo(
      losingMovieItem[0].elo,
      expectedScore_losing,
      0,
      list.initialK,
      losingMovieItem[0].count,
      list.tuningFactor,
    );

    // add to history
    const dbinsert = db.insert(movieListComparisonHistory).values({
      movieListId: data.movieListId,
      winningMovieListItemId: data.winningMovieListItemId,
      losingMovieListItemId: data.losingMovieListItemId,
      winFirst: data.winFirst,
      eloGain: Math.round(winnerElo - winningMovieItem[0].elo),
      eloLoss: -Math.round(loserElo - losingMovieItem[0].elo),
    });

    // update elo
    const elo1 = updateElo(
      data.winningMovieListItemId,
      data.movieListId,
      winnerElo,
    );
    const elo2 = updateElo(
      data.losingMovieListItemId,
      data.movieListId,
      loserElo,
    );

    await elo1;
    await elo2;
    await dbinsert;
  });

const updateElo = (tmdbId: string, listId: string, elo: number) => {
  return db
    .update(movieListItem)
    .set({
      currentElo: Math.round(elo),
    })
    .where(
      and(
        eq(movieListItem.tmdbId, tmdbId),
        eq(movieListItem.movieListId, listId),
      ),
    );
};

const getItemEloData = (listId: string, itemId: string) =>
  db
    .select({
      elo: movieListItem.currentElo,
      count: count(movieListComparisonHistory.id),
    })
    .from(movieListItem)
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
    ) // grouping by elo should be fine as there could only be one row
    .where(
      and(
        eq(movieListItem.tmdbId, itemId),
        eq(movieListItem.movieListId, listId),
      ),
    );
