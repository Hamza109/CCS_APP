import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import SearchBar from "../../src/components/ui/SearchBar";
import { ROUTES } from "../../src/constants/routes";
import { useAppDispatch, useAppSelector } from "../../src/store";
import { triggerLocationPermissionRequest } from "../../src/store/slices/appSlice";
import { clearToken } from "../../src/store/slices/authSlice";

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const [searchQuery, setSearchQuery] = useState("");
  const isOnline = useAppSelector((state) => state.app.isOnline);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(triggerLocationPermissionRequest());
    }, [dispatch])
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results or perform search
      console.log("Searching for:", searchQuery);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("auth_token");
          } catch (error) {
            console.log("Error clearing token:", error);
          }
          dispatch(clearToken());
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  // Quick access items removed - using popular services in 2x2 grid instead

  const popularServices = [
    {
      id: "legal-aid",
      title: "Legal Aid & Advice",
      description: "Find advocates, notaries, and legal assistance",
      icon: "gavel",
      color: "#F7F8FF",
      iconColor: "#0019C4",
      onPress: () => router.push(ROUTES.LEGAL_AID.ROOT),
    },
    {
      id: "acts-rules",
      title: "Acts, Rules & Notifications",
      description: "Central and State Acts, Rules, and Notifications",
      icon: "scroll",
      color: "#F2FCFF",
      iconColor: "#1782A2",
      onPress: () => router.push("/acts-rules"),
    },
    {
      id: "legislative-assembly",
      title: "Legislative Assembly",
      description: "MLAs, Committees, Reports, and Live Proceedings",
      icon: "university",
      color: "#FEEFF6",
      iconColor: "#A7396C",
      onPress: () => router.push(ROUTES.LEGISLATIVE_ASSEMBLY.ROOT),
    },
    {
      id: "litigation",
      title: "Search your case",
      description: "Case Status, Cause List, and Landmark Judgments",
      icon: "balance-scale",
      color: "#FEEFF6",
      iconColor: "#A7396C",
      onPress: () => router.push(ROUTES.SEARCH_CASE.ROOT),
    },
    {
      id: "find-court",
      title: "Find my court",
      description: "Locate courts and legal institutions near you",
      icon: "map-marker-alt",
      color: "#FEFBEF",
      iconColor: "#8E7200",
      onPress: () => router.push(ROUTES.FIND_COURT.ROOT),
    },
    {
      id: "law-education",
      title: "Law Education",
      description: "Universities, Courses, and Guidance Articles",
      icon: "graduation-cap",
      color: "#FFF7F7",
      iconColor: "#802222",
      onPress: () => router.push(ROUTES.LAW_EDUCATION.ROOT),
    },
    {
      id: "advocates",
      title: "Advocates",
      description: "Enrollment, Appointment, and Welfare Schemes",
      icon: "user-tie",
      color: "#F7FFF8",
      iconColor: "#1E882C",
      onPress: () => router.push(ROUTES.ADVOCATES.ROOT),
    },
    {
      id: "document-registration",
      title: "Document Registration",
      description: "Registration Guides, Templates, and Stamp Vendors",
      icon: "file-alt",
      color: "#F7FDFF",
      iconColor: "#176079",
      onPress: () => router.push(ROUTES.DOCUMENT_REGISTRATION.ROOT),
    },
    {
      id: "marriage-registration",
      title: "Registration of Marriage",
      description:
        "Guidance and information on marriage registration acts and authorities",
      icon: "user-friends",
      color: "#FFB6C1",
      iconColor: "#fff",
      onPress: () => router.push(ROUTES.MARRIAGE_REGISTRATION.ROOT),
    },
    {
      id: "women-children",
      title: "Women & Children Development",
      description:
        "Schemes, rights, and welfare programs for women and children",
      icon: "child", // 👈 FontAwesome icon suggestion
      color: "#F2FCFF",
      iconColor: "#1782A2",
      onPress: () => router.push(ROUTES.WOMEN_CHILDREN.ROOT),
    },
    {
      id: "consumer-commission",
      title: "Consumer Commission",
      description:
        "Lodge complaints, track cases, and know your consumer rights",
      icon: "users", // 👥 or "handshake" also fits
      color: "#FEEFF6",
      iconColor: "#A7396C",
      onPress: () => router.push("/consumer-commission" as any),
    },
    {
      id: "grievance",
      title: "Grievance & Feedback",
      description: "File complaints and provide feedback",
      icon: "comments",
      color: "#FEFBEF",
      iconColor: "#8E7200",
      onPress: () =>
        router.push({
          pathname: ROUTES.LEGAL_AID.CONTACT_FORM,
          params: { type: "grievance" },
        } as any),
    },
  ];

  const bannerData = {
    title: "Ask the chatbot",
    description:
      "Access comprehensive legal information and services at your fingertips",
    actionText: "Chat With Us",
    onAction: () => router.push("/chatbot"),
  };

  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      {/* Blue Header */}
      {/* Status Indicator */}
      {!isOnline && (
        <Card style={styles.offlineCard}>
          <View style={styles.offlineContent}>
            <Ionicons name='cloud-offline' size={20} color='#FF6B6B' />
            <Text style={styles.offlineText}>
              You're offline. Some features may be limited.
            </Text>
          </View>
        </Card>
      )}
      <View style={styles.blueHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Citizen-centric Services</Text>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleLogout}
          >
            <Ionicons name='log-out-outline' size={24} color='#FFFFFF' />
          </Pressable>
        </View>
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder='Acts, Lawyers...'
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearch={handleSearch}
            showFilter
            onFilterPress={() => {}}
          />
        </View>
      </View>

      {/* Search Bar */}

      <View style={styles.scrollView}>
        {/* Main Content with Curved Design */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.mainContent}
        >
          {/* Our Services - Grid */}
          <View style={styles.popularServicesSection}>
            <Text style={styles.popularServicesTitle}>Our Services</Text>
            <View style={styles.servicesGrid}>
              {popularServices.map((service, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.serviceGridItem,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={service.onPress}
                >
                  <View
                    style={
                      [
                        styles.serviceGridIcon,
                        { backgroundColor: service.color },
                      ] as any
                    }
                  >
                    <FontAwesome5
                      name={service.icon}
                      size={24}
                      color={service.iconColor}
                    />
                  </View>
                  <Text style={styles.serviceGridText}>{service.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Banner */}
          <Card style={styles.bannerCard} onPress={bannerData.onAction}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>{bannerData.title}</Text>
                <Text style={styles.bannerDescription}>
                  {bannerData.description}
                </Text>
              </View>
              <Button
                title={bannerData.actionText}
                onPress={bannerData.onAction}
                variant='outline'
                size='small'
                style={styles.bannerButton}
              />
            </View>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  darkContainer: {
    backgroundColor: "#000000",
  },
  // Blue Header
  blueHeader: {
    backgroundColor: "#1E3A8A",

    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoutButton: {
    padding: 8,
  },
  // Search Bar
  searchContainer: {
    backgroundColor: "#1E3A8A",
  },
  // Main Content with Curved Design
  mainContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    paddingTop: 30,
    paddingBottom: 20,
    flex: 1,
  },
  // Services Grid (2x2)
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  serviceGridItem: {
    width: (width - 60) / 2,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceGridIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  serviceGridText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    lineHeight: 16,
  },
  // Popular Services Section
  popularServicesSection: {
    paddingHorizontal: 20,
  },
  popularServicesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  // Scroll View
  scrollView: {
    flex: 1,
  },
  // Banner
  bannerCard: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: "#007AFF",
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  bannerButton: {
    borderColor: "#FFFFFF",
  },
  bannerIconButton: {
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 36,
  },
  // Offline Card
  offlineCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#FFF3F3",
    borderColor: "#FF6B6B",
  },
  offlineContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#FF6B6B",
    flex: 1,
  },
});

export default HomeScreen;
