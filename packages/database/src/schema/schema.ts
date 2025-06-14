import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";



const timestamps = {
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp().defaultNow().notNull(),
};

const id = () => uuid().primaryKey().notNull().unique().defaultRandom();

// as much as possible of this should be optional, as supabase will auto create one on signup
export const userProfile = pgTable("user", {
  id: id(),
  isAdmin: boolean().default(false).notNull(),

  avatarUrl: text(),

  firstName: text().notNull(),
  lastName: text(),

  avatar: text(),
  ...timestamps,
});

export const movieList = pgTable("movie_list", {
  id: id(),
  name: text().notNull(),
  description: text(),
  userId: uuid()
    .notNull()
    .references(() => userProfile.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  initialK: integer().default(10).notNull(), // how quickly elo changes, 
  tuningFactor: integer().default(10).notNull(), // how quick k decreases, ie 5 would mean after 5 runs k halves

  ...timestamps,
});

export const movieListItem = pgTable(
  "movie_list_item",
  {
    tmdbId: text().notNull(),
    movieListId: uuid().references(() => movieList.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

    userId: uuid(),

    // comparisonCount: integer().default(0).notNull(),

    currentElo: integer().default(1500).notNull(),

    ...timestamps,
  },
  (table) => [
    primaryKey({
      columns: [table.tmdbId, table.movieListId],
    }),
  ]
);

export const movieListComparisonHistory = pgTable(
  "movie_list_comparison_history",
  {
    id: id(),

    movieListId: uuid()
      .references(() => movieList.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    winningMovieListItemId: text().notNull(),
    losingMovieListItemId: text().notNull(),

    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.movieListId, table.winningMovieListItemId],
      foreignColumns: [movieListItem.movieListId, movieListItem.tmdbId],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    foreignKey({
      columns: [table.movieListId, table.losingMovieListItemId],
      foreignColumns: [movieListItem.movieListId, movieListItem.tmdbId],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ]
);


