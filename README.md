# Notes App 📝

Hey there! 👋 This is a React Native notes app for you to create notes, organize them, and view summaries.

## Getting Started 🚀
### Environment & SDK Versions 🛠️
**Runtime Environment:**
- Node.js: v18.17.0
- npm: v9.6.7
- yarn: v1.22.19

**Mobile Development:**
- React Native: v0.78.1
- iOS: Xcode 15.3
- Android: Android Studio Meerkat | 2024.3.1 Patch 1
- Android SDK: 33 (Android 13)

**Key Dependencies:**
- React: v19.0.0
- React Navigation: v7.0.19
- TypeScript: v5.0.4

**Required tools:**
- Node.js (v14+)
- npm or yarn
- Xcode (for iOS)
- Android Studio (for Android)
- Git

### How to Run It

1. Clone this repo:
```sh
git clone https://github.com/CHIAMMING/NotesApp.git
cd NotesApp
```

2. Install the dependencies:
```sh
npm install
# or
yarn install
```

3. Start the dev server:
```sh
npm start
# or
yarn start
```

4. Run it on your device/simulator:

For Android:
```sh
npm run android
# or
yarn android
```

For iOS (you'll need to do this first time):
```sh
bundle install
bundle exec pod install
npm run ios
# or
yarn ios
```

## What Can It Do? 🤔

- Create and edit notes
- Organize notes by category
- See summaries of your notes
- Works on both iOS and Android

## Project Structure 📁

Here's how the code is organized:
```
NotesApp/
├── src/
│   ├── assets/      # All the images and icons
│   ├── components/  # Components used in the pages
│   ├── navigation/  # How the app moves around
│   ├── screens/     # The main screens
│   ├── types/       # TypeScript stuff
│   └── utils/       # Helper functions
├── ios/            # iOS specific stuff
└── android/        # Android specific stuff
```
