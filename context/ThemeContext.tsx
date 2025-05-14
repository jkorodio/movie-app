"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useColorScheme } from "react-native";

interface ThemeColors {
  backgroundColor: string;
  cardBackground: string;
  textColor: string;
  textColorLight: string;
  borderColor: string;
  inputBackground: string;
  dark: boolean;
}

const lightTheme: ThemeColors = {
  backgroundColor: "#F8F9FA",
  cardBackground: "#FFFFFF",
  textColor: "#212529",
  textColorLight: "#6C757D",
  borderColor: "#DEE2E6",
  inputBackground: "#FFFFFF",
  dark: false,
};

const darkTheme: ThemeColors = {
  backgroundColor: "#121212",
  cardBackground: "#1E1E1E",
  textColor: "#E9ECEF",
  textColorLight: "#ADB5BD",
  borderColor: "#343A40",
  inputBackground: "#2A2A2A",
  dark: true,
};

interface ThemeContextType {
  theme: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeColors>(
    colorScheme === "dark" ? darkTheme : lightTheme
  );

  useEffect(() => {
    setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.dark ? lightTheme : darkTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
