require("dotenv").config();

module.exports = {
  expo: {
    name: "e-nyaya sarthi",
    slug: "ccs-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "ccs-app",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ccs.app",
      associatedDomains: [
        "applinks:ccs.gov.in",
        "applinks:app.ccs.gov.in",
        "applinks:ccs.gov.in",
        "applinks:app.ccs.gov.in",
      ],
      statusBar: {
        style: "light",
        backgroundColor: "#1E3A8A",
      },
    },
    android: {
      usesCleartextTraffic: true,
      adaptiveIcon: {
        backgroundColor: "#FFFFFF",
        foregroundImage: "./assets/images/icon.png",
        backgroundImage: "./assets/images/icon.png",
        monochromeImage: "./assets/images/icon.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.ccs.app",
      statusBar: {
        style: "light",
        backgroundColor: "#1E3A8A",
      },
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "ccs.gov.in",
            },
            {
              scheme: "https",
              host: "app.ccs.gov.in",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "ccs.gov.in",
            },
            {
              scheme: "https",
              host: "app.ccs.gov.in",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#FFFFFF",
          dark: {
            backgroundColor: "#FFFFFF",
          },
        },
      ],
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "71764f7c-7dcb-4f50-bdb6-223cf7b763a4",
      },
      // Encryption key from .env file
      encryptionKey:
        process.env.ENCRYPTION_KEY || "your-32-character-secret-key-here",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    owner: "law_1110",
  },
};
