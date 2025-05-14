import type { Movie, MovieDetails, MovieVideo } from "../types";

const API_KEY =
  process.env.EXPO_PUBLIC_API_KEY || "794cd92525d5fd81dbc9e62ac0401df8";
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.themoviedb.org/3";

export async function getPopularMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch popular movies");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
}

export async function searchMoviesByQuery(query: string): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        query
      )}&page=1&include_adult=false`
    );

    if (!response.ok) {
      throw new Error("Failed to search movies");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

export async function getMovieVideos(movieId: number): Promise<MovieVideo[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie videos");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    throw error;
  }
}
