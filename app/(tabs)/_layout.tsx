import { Ionicons,MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useAppSelector } from "../../src/store";

export default function TabLayout() {
  const theme = useAppSelector((state) => state.app.theme);

  return (
    <Tabs
      screenOptions={{
        lazy: true, 
        
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#6C757D",
        tabBarStyle: {
          backgroundColor: theme === "dark" ? "#1C1C1E" : "#FFFFFF",
          borderTopColor: theme === "dark" ? "#2C2C2E" : "#E5E5E5",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='chatbot'
        options={{
          title: "Chatbot",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='face-agent' size={size*1.2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
