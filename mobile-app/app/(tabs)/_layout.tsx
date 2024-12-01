import { Stack, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { routeToScreen } from "expo-router/build/useScreens";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({route}) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarStyle: {
          display: route.name === "index" ? "none" : "flex",
        },
      })}
    >
      <Tabs.Screen
        name="project-description"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="observation-list"
        options={{
          title: "Observations",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "list" : "list-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='form'
        options={{
          title: 'New Observation',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add' : 'add-circle-outline'} color={color} />
          ),
        }}/>
      <Tabs.Screen
        name='logout'
        options={{
          title: 'Logout',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'log-out' : 'log-out-outline'} color={color} />
          ),
        }}/>
    </Tabs>
  );
}
