import { relations } from "drizzle-orm/relations";
import {
  movieList,
  movieListComparisonHistory,
  movieListItem,
  userProfile,
} from "./schema";

export const userRelations = relations(userProfile, ({ one, many }) => ({
  lists: many(movieList),
  // items: many(movieListItem),
}));

export const movieListRelations = relations(movieList, ({ one, many }) => ({
  user: one(userProfile, {
    fields: [movieList.userId],
    references: [userProfile.id],
  }),
  items: many(movieListItem),
  comparisonHistory: many(movieListComparisonHistory),
}));

export const movieListItemRelations = relations(
  movieListItem,
  ({ one, many }) => ({
    list: one(movieList, {
      fields: [movieListItem.movieListId],
      references: [movieList.id],
    }),

    winningComparisons: many(movieListComparisonHistory, {
      relationName: "winningItem",
    }),
    losingComparisons: many(movieListComparisonHistory, {
      relationName: "losingItem",
    }),
    addedBy: one(userProfile, {
      fields: [movieListItem.userId],
      references: [userProfile.id],
    }),
  }),
);

export const movieListComparisonHistoryRelations = relations(
  movieListComparisonHistory,
  ({ one }) => ({
    list: one(movieList, {
      fields: [movieListComparisonHistory.movieListId],
      references: [movieList.id],
    }),
    winningItem: one(movieListItem, {
      fields: [
        movieListComparisonHistory.movieListId,
        movieListComparisonHistory.winningMovieListItemId,
      ],
      references: [movieListItem.movieListId, movieListItem.tmdbId],
      relationName: "winningItem",
    }),
    losingItem: one(movieListItem, {
      fields: [
        movieListComparisonHistory.movieListId,
        movieListComparisonHistory.losingMovieListItemId,
      ],
      references: [movieListItem.movieListId, movieListItem.tmdbId],
      relationName: "losingItem",
    }),
  }),
);
