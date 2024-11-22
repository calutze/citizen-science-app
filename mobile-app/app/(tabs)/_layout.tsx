import { Stack, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const sample_form_data = {
  form_id: 1,
  elements: [
    {
      id: 1,
      title: "Text Input",
      type: "TextInput",
      options: { placeholder: "Enter your text here" },
      order: 1,
    },
  ],
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
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
        name='login'
        options={{
          title: 'Login',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}/>
        <Tabs.Screen
          name='form'
          options={{
            title: 'New Observation',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'add' : 'add-circle-outline'} color={color} />
            ),
          }}/>
    </Tabs>
  );
}
