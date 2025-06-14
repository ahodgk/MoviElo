import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
  getMovieDetailsFn,
  listMoviesFn,
} from "~/lib/functions/tmdb/list-movies";

export const listMoviesQueryOptions = ({ query }: { query?: string }) =>
  queryOptions({
    queryKey: ["tmdb", "list-movies", { query }],
    queryFn: () =>
      listMoviesFn({
        data: { query },
      }),

    placeholderData: keepPreviousData,
  });

export const getMovieDetailsQueryOptions = (tmdbId: string) =>
  queryOptions({
    queryKey: ["tmdb", "movie", tmdbId],
    queryFn: () => getMovieDetailsFn({ data: { tmdbId } }),
    placeholderData: keepPreviousData,
  });
