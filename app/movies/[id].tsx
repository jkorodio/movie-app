"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Linking,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { getMovieDetails, getMovieVideos } from "../../services/api";
import type { MovieDetails, MovieVideo } from "../../types";

const { width } = Dimensions.get("window");

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playingVideo, setPlayingVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MovieVideo | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError("");

        const movieData = await getMovieDetails(Number(id));
        setMovie(movieData);

        const videosData = await getMovieVideos(Number(id));
        setVideos(videosData);

        const trailer = videosData.find(
          (video) =>
            video.type.toLowerCase() === "trailer" &&
            video.site.toLowerCase() === "youtube"
        );

        if (trailer) {
          setSelectedVideo(trailer);
        }
      } catch (err) {
        setError("Failed to load movie details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  const handlePlayTrailer = () => {
    if (selectedVideo) {
      if (selectedVideo.site.toLowerCase() === "youtube") {
        const youtubeUrl = `https://www.youtube.com/watch?v=${selectedVideo.key}`;
        setPlayingVideo(true);
        // Option to open in YouTube app or browser
        Linking.canOpenURL(youtubeUrl).then((supported) => {
          if (supported) {
            Linking.openURL(youtubeUrl);
          } else {
            console.log("Can't open YouTube URL");
          }
        });
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.backgroundColor },
        ]}
      >
        <ActivityIndicator size="large" color="#032541" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.errorContainer,
          { backgroundColor: theme.backgroundColor },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.textColor }]}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView
        style={[
          styles.errorContainer,
          { backgroundColor: theme.backgroundColor },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.textColor }]}>
          Movie not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Stack.Screen
        options={{
          title: movie.title,
          headerBackTitle: "Movies",
        }}
      />

      <ScrollView>
        <View style={styles.backdropContainer}>
          <Image
            source={{
              uri: movie.backdrop_path
                ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
                : `https://image.tmdb.org/t/p/w780${movie.poster_path}`,
            }}
            style={styles.backdropImage}
            resizeMode="cover"
          />
          <View style={styles.backdropOverlay} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.posterContainer}>
            <Image
              source={{
                uri: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                  : "https://via.placeholder.com/342x513?text=No+Poster",
              }}
              style={styles.posterImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.detailsContainer}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              {movie.title}
            </Text>

            <View style={styles.metaContainer}>
              <Text style={[styles.releaseDate, { color: theme.textColor }]}>
                {new Date(movie.release_date).toLocaleDateString()}
              </Text>
              <View style={styles.ratingContainer}>
                <AntDesign name="star" size={16} color="#FFD700" />
                <Text style={[styles.rating, { color: theme.textColor }]}>
                  {movie.vote_average.toFixed(1)}/10
                </Text>
              </View>
            </View>

            {selectedVideo && (
              <TouchableOpacity
                style={styles.trailerButton}
                onPress={handlePlayTrailer}
              >
                <Ionicons name="play-circle-outline" size={20} color="white" />
                <Text style={styles.trailerButtonText}>Watch Trailer</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Overview
          </Text>
          <Text style={[styles.overview, { color: theme.textColor }]}>
            {movie.overview || "No overview available."}
          </Text>
        </View>

        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Genres
            </Text>
            <View style={styles.genresContainer}>
              {movie.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Additional Info
          </Text>
          <View style={styles.additionalInfoContainer}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.textColor }]}>
                Status
              </Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>
                {movie.status}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.textColor }]}>
                Runtime
              </Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>
                {movie.runtime ? `${movie.runtime} min` : "N/A"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.textColor }]}>
                Budget
              </Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>
                {movie.budget
                  ? `$${(movie.budget / 1000000).toFixed(1)}M`
                  : "N/A"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.textColor }]}>
                Revenue
              </Text>
              <Text style={[styles.infoValue, { color: theme.textColor }]}>
                {movie.revenue
                  ? `$${(movie.revenue / 1000000).toFixed(1)}M`
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {videos.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Videos
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.videosScrollView}
            >
              {videos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={[
                    styles.videoItem,
                    selectedVideo?.id === video.id && styles.selectedVideoItem,
                  ]}
                  onPress={() => {
                    setSelectedVideo(video);
                    setPlayingVideo(false);
                  }}
                >
                  <View style={styles.videoThumbnailContainer}>
                    <Image
                      source={{
                        uri: `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`,
                      }}
                      style={styles.videoThumbnail}
                    />
                    <View style={styles.playIconContainer}>
                      <Ionicons name="play-circle" size={30} color="white" />
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.videoTitle,
                      { color: theme.textColor },
                      selectedVideo?.id === video.id &&
                        styles.selectedVideoTitle,
                    ]}
                    numberOfLines={2}
                  >
                    {video.name}
                  </Text>
                  <Text style={styles.videoType}>{video.type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -62,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  backdropContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  backdropImage: {
    width: "100%",
    height: "100%",
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  infoContainer: {
    flexDirection: "row",
    marginTop: -40,
    paddingHorizontal: 16,
  },
  posterContainer: {
    width: 100,
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  posterImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  releaseDate: {
    fontSize: 14,
    marginRight: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
  },
  trailerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E50914",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  trailerButtonText: {
    color: "white",
    marginLeft: 4,
    fontWeight: "500",
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  overview: {
    fontSize: 15,
    lineHeight: 22,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreTag: {
    backgroundColor: "#032541",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: "white",
    fontSize: 12,
  },
  additionalInfoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoItem: {
    width: "48%",
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
  },
  videosScrollView: {
    marginTop: 8,
  },
  videoItem: {
    width: 200,
    marginRight: 12,
    borderRadius: 8,
    padding: 8,
  },
  selectedVideoItem: {
    backgroundColor: "rgba(3, 37, 65, 0.1)",
  },
  videoThumbnailContainer: {
    width: "100%",
    height: 110,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
  },
  playIconContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 4,
  },
  selectedVideoTitle: {
    color: "#032541",
  },
  videoType: {
    fontSize: 12,
    color: "#666",
  },
  bottomPadding: {
    height: 40,
  },
});
