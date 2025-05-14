"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { getPopularMovies, searchMoviesByQuery } from "../services/api";
import type { Movie } from "../types";

interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  error: string;
  fetchMovies: () => Promise<void>;
  searchMovies: (query: string) => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function useMovies() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
}

interface MovieProviderProps {
  children: ReactNode;
}

export function MovieProvider({ children }: MovieProviderProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPopularMovies();
      setMovies(data);
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query: string) => {
    try {
      setLoading(true);
      setError("");
      const data = await searchMoviesByQuery(query);
      setMovies(data);
    } catch (err) {
      setError("Failed to search movies. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    movies,
    loading,
    error,
    fetchMovies,
    searchMovies,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}
