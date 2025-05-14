import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MovieProvider } from "../context/MovieContext";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MovieProvider>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#032541",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              animation: "slide_from_right",
              contentStyle: {
                paddingTop: 0, // Remove default padding
              },
            }}
          />
        </SafeAreaProvider>
      </MovieProvider>
    </ThemeProvider>
  );
}
