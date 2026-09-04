# Evolum Wellness — Native Android Application

This directory contains the native Android application built with **Kotlin**, **Jetpack Compose**, **Material 3**, and the **Android SDK**.

## Architecture & Tech Stack

- **UI Framework**: Modern Jetpack Compose with Material 3 Dark Palette
- **Language**: Kotlin 2.1.0 with Coroutines & StateFlow
- **Minimum SDK**: API 26 (Android 8.0 Oreo)
- **Target / Compile SDK**: API 35 (Android 15)
- **Audio Engine**: AndroidX Media3 ExoPlayer for guided meditation and breathwork soundscapes
- **Hardware Integration**: Android Vibrator / Haptic Feedback (`VibrationEffect`) for tactile breathing pacing
- **State Management**: AndroidViewModel with unidirectional data flow (`StateFlow`)
- **Localization**: Full RTL & Arabic localization alongside English (`res/values-ar/strings.xml`)

## Project Structure

```
android/
├── app/
│   ├── build.gradle.kts          # Dependencies (Compose, Media3, Lifecycle)
│   └── src/main/
│       ├── AndroidManifest.xml   # Permissions (Haptics, Audio, Internet)
│       ├── java/com/evolum/wellness/
│       │   ├── MainActivity.kt               # Entry point & Scaffold navigation
│       │   ├── EvolumApplication.kt          # Application class
│       │   ├── model/Models.kt               # Session, Metrics, and Progress models
│       │   ├── data/SessionRepository.kt     # Meditation, Yoga & Badges data
│       │   ├── viewmodel/WellnessViewModel.kt# Coroutine timers & state management
│       │   ├── ui/theme/                     # Theme, Color, Type
│       │   ├── ui/components/AuraBottomNav.kt# Navigation bar
│       │   └── ui/screens/
│       │       ├── HomeScreen.kt             # Dashboard & featured sessions
│       │       ├── BreathingScreen.kt        # Animated 4-4-4 resonant breathwork
│       │       ├── LongevityScreen.kt        # Biological age & biomarker dashboard
│       │       ├── AICoachScreen.kt          # Gemini AI somatic coach
│       │       ├── PlayerScreen.kt           # Immersive audio player
│       │       └── ProgressScreen.kt         # Streaks, badges, and intent sharing
│       └── res/
│           ├── values/strings.xml            # English strings
│           ├── values-ar/strings.xml         # Arabic strings (RTL)
│           ├── values/colors.xml             # Theme color palette
│           └── values/themes.xml             # Android system theme
├── build.gradle.kts              # Root Gradle configuration
├── settings.gradle.kts           # Module definitions
└── gradle.properties
```

## How to Run in Android Studio

1. Open **Android Studio** (Ladybug or newer).
2. Choose **Open an Existing Project** and select the `/android` folder.
3. Allow Gradle to sync dependencies.
4. Select an Android Emulator or physical device (API 26+).
5. Click **Run 'app'** (`Shift + F10`).

## Command Line Build

```bash
cd android
./gradlew assembleDebug
```
The resulting APK will be generated at `app/build/outputs/apk/debug/app-debug.apk`.
