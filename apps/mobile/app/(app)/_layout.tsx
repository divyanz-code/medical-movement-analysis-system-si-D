import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { moderateScale, responsiveFont } from "../../src/ui/theme";
import { useAppTheme } from "../../src/ui/themeProvider";

export default function AppTabsLayout() {
  const { colors } = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          backgroundColor: colors.background,
          height: moderateScale(74),
          paddingBottom: moderateScale(12),
          paddingTop: moderateScale(6),
          borderRadius: 0
        },
        tabBarItemStyle: {
          paddingTop: 0
        },
        tabBarLabelStyle: {
          fontSize: responsiveFont(11),
          fontWeight: "600"
        },
        animation: "none"
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <Feather name="clock" size={20} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Feather name="settings" size={20} color={color} />
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          href: null,
          tabBarStyle: { display: "none" }
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          href: null,
          tabBarStyle: { display: "none" }
        }}
      />
    </Tabs>
  );
}
