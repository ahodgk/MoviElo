import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetch } from "~/lib/fetch-cache";
import { protectMiddleware } from "~/lib/middleware/auth";
import type { MovieDetails } from "./_types";

const tmdb_api = "https://api.themoviedb.org/3";

type TMDBResult = {
  page: number;
  results: {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }[];
};

export const listMoviesFn = createServerFn()
  .middleware([protectMiddleware])
  .validator(z.object({ query: z.string().optional() }))
  .handler(async ({ context, data }) => {
    const res = await fetch(
      data.query
        ? `${tmdb_api}/search/movie?query=${data.query}`
        : `${tmdb_api}/discover/movie`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    const json = (await res.json()) as TMDBResult;

    return json.results;
  });

export const getMovieDetailsFn = createServerFn()
  .middleware([protectMiddleware])
  .validator(z.object({ tmdbId: z.string() }))
  .handler(async ({ data }) => {
    const res = await fetch(`${tmdb_api}/movie/${data.tmdbId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch movie details: ${res.statusText}`);
    }
    return (await res.json()) as MovieDetails;
  });
