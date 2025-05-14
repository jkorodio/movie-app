# React Native Movie App

A mobile movie application built with React Native and Expo that allows users to browse movies, search for specific titles, view detailed information, and watch trailers.

![Movie App Screenshot](https://via.placeholder.com/800x400?text=Movie+App+Screenshot)

## Features

- Browse popular movies with poster images, titles, and ratings
- Search for movies by title
- View detailed movie information (overview, genres, release date, etc.)
- Watch movie trailers via YouTube
- Dark/light theme support with system theme detection
- Responsive design for various device sizes
- Pull-to-refresh functionality

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router for navigation
- React Context API for state management
- TMDB API for movie data

## Setup Instructions

### Prerequisites

- Node.js v22.13.1
- npm or yarn
- Expo CLI
- TMDB API key (get one from [The Movie Database](https://www.themoviedb.org/documentation/api))

### Installation

1. Clone the repository

   - git clone https://github.com/yourusername/movie-app.git
   - cd movie-app

2. Install Dependencies

   - npm install or yarn install

3.Configure environment variables (see .env file)

    - I added fallback incase .env is not found

4. Start the application

   - npm expo start

5.Run on a device or emulator

    - Press `i` to run on iOS Simulator
    - Press `a` to run on Android Emulator
    - Scan the QR code with the Expo Go app on your physical device
