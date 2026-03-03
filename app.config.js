require("dotenv").config();

module.exports = {
  expo: {
    name: "e-nyaya sarthi",
    slug: "ccs-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "enyayasarathi",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "in.gov.jk.enyayasarathi",
      associatedDomains: [
        "applinks:enyayasarathi.jk.gov.in",
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
      package: "in.gov.jk.enyayasarathi",
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
              host: "enyayasarathi.jk.gov.in",
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
      [
        "expo-build-properties",
        {
          android: {
            enableMinifyInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            usesCleartextTraffic: true,
            extraProguardRules:
              "-keep class com.facebook.react.** { *; }\n-keep class com.facebook.hermes.** { *; }\n-keepattributes SourceFile,LineNumberTable\n-keepattributes *Annotation*",
          },
        },
      ],
      [
        "expo-network-security-config",
        {
          networkSecurityConfig: "./assets/configs/network_security_config.xml",
          enable: true,
        },
      ],
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
