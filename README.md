# Citizen-Centric Services (CCS) Mobile App

A comprehensive React Native Expo app built with TypeScript for a Citizen-Centric Services platform. The app provides access to legal services, advocates, acts & rules, legislative assembly information, and more.

## 🚀 Features

### Core Modules

- **Legal Aid & Advice** - Find advocates, notaries, and legal assistance
- **Acts, Rules & Notifications** - Central and State Acts, Rules, and Notifications
- **Legislative Assembly** - MLAs, Committees, Reports, and Live Proceedings
- **Litigation Related** - Case Status, Cause List, and Landmark Judgments
- **Law Education** - Universities, Courses, and Guidance Articles
- **Advocates** - Enrollment, Appointment, and Welfare Schemes
- **Document Registration** - Registration Guides, Templates, and Stamp Vendors
- **Marriage Registration** - Hindu & Special Marriage Act Information
- **Grievance & Feedback** - File complaints and provide feedback
- **AI Chatbot** - Legal assistant for queries and guidance

### Technical Features

- **Offline Support** - Cache data for offline access using AsyncStorage
- **Deep Linking** - Support for custom URL schemes and web links
- **Modern UI** - Clean, responsive design with dark/light theme support
- **Type Safety** - Full TypeScript implementation
- **State Management** - Redux Toolkit for global state
- **Navigation** - Expo Router with Tabs + Stack navigation
- **Network Status** - Real-time network monitoring
- **Responsive Design** - Optimized for different screen sizes

## 📋 Screen Inventory & Key Flows

| Module                       | Screens                                                                                                                                                                                                                                                                          | Highlights                                                                                                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Authentication**           | **Login**, **OTP Verification**                                                                                                                                                                                                                                                  | Validates mobile number, hits `/api/otp/send`, stores the returned OTP locally, and unlocks the app only when the user enters the matching code.                           |
| **Home & Tabs**              | **Home Dashboard**, **Chatbot**, **Search Case Hub**, **Legal Aid**, **Acts & Rules**, **Legislative Assembly**, **Find My Court**, **Document Registration**, **Marriage Registration**, **Advocates**, **Women & Children**, **Consumer Commission**, **Grievance & Feedback** | Unified hub with quick actions, offline-aware content, AI chatbot, and shortcuts into every service vertical.                                                              |
| **Search Case – High Court** | **High Court Search**, **High Court List**, **High Court Result**                                                                                                                                                                                                                | Search by wing/case type/advanced fields, show paginated results, “View More” drill-down with parsed JSON fields, downloadable orders, and clean error/loading states.     |
| **Search Case – CAT**        | **CAT Search**, **CAT List**, **CAT Result**                                                                                                                                                                                                                                     | Mirrors High Court UX using `/api/cat/cases/search` plus daily & final order cards, download buttons, and combined loader/error handling.                                  |
| **Search Case – Others**     | **District Court Search**, **FCR Court Search**                                                                                                                                                                                                                                  | Dedicated forms with pickers, validator-driven input, and navigation into downstream case views.                                                                           |
| **Case Detail Extras**       | Embedded screens such as **Daily Orders**, **Final Orders**, **Parsed Acts/Sections**                                                                                                                                                                                            | Conditional rendering, JSON parsing, and one-tap download links ensure users only see meaningful data.                                                                     |
| **System Utilities**         | **Location Permission Gate**, **Page Hit Tracker**, **Network Status Banner**                                                                                                                                                                                                    | Requests location once from the home screen, reverse-geocodes state/district/country, logs every navigation via `/api/page-hits`, and surfaces connectivity issues inline. |

> 💡 In total the app bundles **30+ routed screens**, spanning authentication, dashboard tabs, rich search flows, and every knowledge module described above.

## 🛠 Technology Stack

- **Framework**: React Native with Expo (managed workflow)
- **Language**: TypeScript
- **Navigation**: Expo Router + React Navigation v6
- **State Management**: Redux Toolkit
- **Storage**: AsyncStorage for offline caching
- **UI Components**: Custom components with Material Design principles
- **API**: Axios for HTTP requests
- **Icons**: Expo Vector Icons
- **Network**: React Native Community NetInfo

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Card, Input, etc.)
│   ├── lists/          # List components (ListItem, etc.)
│   └── forms/          # Form components
├── screens/            # Screen components (organized by feature)
├── services/           # API services and data layer
├── store/              # Redux store and slices
├── types/              # TypeScript interfaces and types
├── utils/              # Utility functions (storage, linking, etc.)
├── hooks/              # Custom React hooks
└── constants/          # App constants and configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CCS_APP
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on specific platforms**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 🚀 Development Commands

### Development Mode

Start the Expo development server:

```bash
# Start Expo dev server
npx expo start

# Or using npm script
npm start
```

**Options:**

- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Press `w` to open in web browser
- Press `r` to reload the app
- Press `m` to toggle menu
- Press `j` to open debugger

### Development with Specific Options

```bash
# Start with tunnel (for testing on physical devices)
npx expo start --tunnel

# Start with LAN (local network)
npx expo start --lan

# Start with localhost only
npx expo start --localhost

# Clear cache and start
npx expo start --clear

# Start in web mode
npx expo start --web
```

### Development Build (Dev Client)

For apps using custom native code or development builds:

```bash
# Run on iOS simulator/device
npx expo run:ios

# Run on Android emulator/device
npx expo run:android

# Run on specific device
npx expo run:ios --device
npx expo run:android --device

# Run with specific configuration
npx expo run:ios --configuration Debug
npx expo run:android --variant debug
```

### Preview Mode

Preview builds for testing before production:

```bash
# Build preview for iOS
eas build --profile preview --platform ios

# Build preview for Android
eas build --profile preview --platform android

# Build preview for both platforms
eas build --profile preview --platform all

# Build and submit to TestFlight (iOS)
eas build --profile preview --platform ios --auto-submit

# Build and submit to Internal Testing (Android)
eas build --profile preview --platform android --auto-submit
```

### Development Server with Preview

```bash
# Start dev server with tunnel for preview
npx expo start --tunnel

# Start dev server and generate QR code for preview
npx expo start --dev-client
```

### Testing App Icon

To verify your app icon is properly configured, you need to create a build (icons don't appear in Expo Go):

**Icon Requirements:**

- **iOS**: 1024x1024px PNG (no transparency)
- **Android**: 1024x1024px PNG (adaptive icon: foreground 1024x1024px, background optional)

**Quick Test - Development Build (Fastest):**

```bash
# Build development client for iOS (simulator/device)
npx expo run:ios

# Build development client for Android (emulator/device)
npx expo run:android

# After build completes, install on device to see the icon
```

**Best Test - Preview Build (Most Accurate):**

Preview builds are closest to production and best for testing icons:

```bash
# Build preview for iOS (downloads .ipa file)
eas build --profile preview --platform ios

# Build preview for Android (downloads .apk or .aab file)
eas build --profile preview --platform android

# After build completes:
# - iOS: Install via TestFlight or direct install
# - Android: Install the .apk file on your device
```

**Check Icon Configuration:**

```bash
# Verify icon file exists and check its properties
ls -lh assets/images/icon.png

# Preview icon in app.json
cat app.json | grep -A 5 "icon"
```

**Icon Testing Checklist:**

- ✅ Icon appears on home screen
- ✅ Icon appears in app switcher/multitasking
- ✅ Icon appears in settings
- ✅ Icon scales properly on different screen sizes
- ✅ Android adaptive icon works (foreground/background)
- ✅ Icon looks good on light and dark backgrounds (Android)

**Note:** Icons are only visible in actual builds, not in Expo Go or web preview.

**When to Run Prebuild:**

Since you have native folders (`android/` and `ios/`), here's when you need `prebuild`:

```bash
# Run prebuild to update native configs from app.json
npx expo prebuild

# Clean prebuild (removes and regenerates native folders)
npx expo prebuild --clean
```

**Do you need prebuild?**

- ✅ **YES** - If you changed `app.json` configs (icon, splash, bundle ID, etc.) and want to ensure native folders are updated
- ✅ **YES** - If you're getting build errors related to missing native configs
- ❌ **NO** - If using `expo run:ios` or `expo run:android` (they auto-prebuild)
- ❌ **NO** - If using EAS builds (EAS handles prebuild automatically)

**Recommended workflow after icon changes:**

```bash
# Option 1: Let expo run handle it automatically
npx expo run:ios        # or npx expo run:android

# Option 2: Explicitly update configs first (recommended after config changes)
npx expo prebuild
npx expo run:ios        # or npx expo run:android
```

### EAS Build Commands

```bash
# List all builds
eas build:list

# View build details
eas build:view

# Cancel a build
eas build:cancel

# Download build
eas build:download
```

### Other Useful Commands

```bash
# Install Expo CLI globally (if needed)
npm install -g expo-cli

# Check Expo CLI version
npx expo --version

# Login to Expo account
npx expo login

# Logout from Expo account
npx expo logout

# Check current account
npx expo whoami

# Initialize EAS project
eas init

# Configure EAS
eas build:configure

# Update Expo SDK
npx expo install expo@latest

# Clear Metro bundler cache
npx expo start --clear

# Clear watchman cache
watchman watch-del-all

# Reset project (clear all caches)
rm -rf node_modules
npm install
npx expo start --clear
```

## 📱 Navigation Structure

### Tab Navigation (Bottom Tabs)

- **Home** - Dashboard with quick access and popular services
- **Services** - List of all available services
- **Chatbot** - AI legal assistant
- **Profile** - User profile and settings

### Stack Navigation (Detail Screens)

- Legal Aid screens
- Acts & Rules screens
- Legislative Assembly screens
- Litigation screens
- Law Education screens
- Advocates screens
- Document Registration screens
- Marriage Registration screens
- Grievance screens
- Detail screens for specific items

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://api.ccs.gov.in
APP_SCHEME=ccs
```

### Deep Linking

The app supports deep linking with the following schemes:

- `ccs://` - Custom app scheme
- `https://ccs.gov.in` - Web domain
- `https://app.ccs.gov.in` - App-specific domain

### Offline Support

The app automatically caches data for offline access:

- Acts and Rules
- Advocates information
- Court directories
- User preferences
- Chat history

## 🎨 UI Components

### Available Components

- **Button** - Customizable button with variants and icons
- **Card** - Container component with elevation and borders
- **Input** - Text input with validation and icons
- **SearchBar** - Search input with filter options
- **ListItem** - List item with icons, badges, and actions
- **NetworkStatus** - Network connectivity indicator

### Theme Support

- Light and dark theme support
- Automatic theme switching based on system preferences
- Customizable colors and typography

## 📊 State Management

### Redux Store Structure

```typescript
{
  app: AppState,           // Global app state
  legalAid: LegalAidState, // Legal aid data
  actsRules: ActsRulesState, // Acts and rules data
  litigation: LitigationState, // Litigation data
  grievance: GrievanceState, // Grievance data
  chatbot: ChatbotState    // Chatbot messages
}
```

### Data Flow

1. User interactions trigger actions
2. Actions update Redux store
3. Components subscribe to store changes
4. UI updates automatically

## 🔌 API Integration

### Service Layer

- Centralized API configuration
- Request/response interceptors
- Error handling
- Mock data for development

### Endpoints

- `/advocates` - Advocate information
- `/courts` - Court directories
- `/acts` - Legal acts
- `/rules` - Legal rules
- `/notifications` - Government notifications
- `/complaints` - Grievance submissions

## 📱 Platform Support

### iOS

- iOS 13.0+
- iPhone and iPad support
- App Store optimization

### Android

- Android 6.0+ (API level 23)
- Phone and tablet support
- Google Play Store optimization

c## 🚀 Deployment

### Development Build

```bash
# Create development build
expo build:android
expo build:ios
```

### Production Build

```bash
# Create production build
expo build:android --type apk
expo build:ios --type archive
```

### App Store Deployment

1. Configure app.json with production settings
2. Build production version
3. Submit to respective app stores
4. Configure deep linking on web servers

## 🔒 Security

### Data Protection

- Secure storage for sensitive data
- API key protection
- User data encryption
- Privacy compliance

### Authentication

- User authentication flow
- Session management
- Secure token storage

## 📈 Performance

### Optimization

- Lazy loading for screens
- Image optimization
- Bundle size optimization
- Memory management

### Monitoring

- Performance metrics
- Error tracking
- User analytics
- Crash reporting

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Standards

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits

## 🔄 Version History

### v1.0.0 (Current)
