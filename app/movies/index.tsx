"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMovies } from "../../context/MovieContext";
import { useTheme } from "../../context/ThemeContext";
import MovieCard from "../../components/MovieCard";
import SearchBar from "../../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";

export default function MoviesScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { movies, loading, error, fetchMovies, searchMovies } = useMovies();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMovies();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchMovies(query);
    } else {
      fetchMovies();
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <MovieCard movie={item} onPress={() => router.push(`/movies/${item.id}`)} />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Stack.Screen
        options={{
          title: "Movies App",
          headerStyle: {
            backgroundColor: "#032541",
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => (
            <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
              <Ionicons
                name={theme.dark ? "sunny-outline" : "moon-outline"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          ),
        }}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search movies..."
      />

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: theme.textColor }]}>
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMovies}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator
            size="large"
            color={theme.dark ? "#fff" : "#032541"}
          />
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#032541"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={[styles.emptyText, { color: theme.textColor }]}>
                {searchQuery ? "No movies found" : "No movies available"}
              </Text>
            </View>
          }
        />
      )}
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 10,
    paddingTop: 5,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#032541",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  themeButton: {
    marginRight: 15,
  },
});
