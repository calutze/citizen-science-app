import { Image, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { useState } from "react";

// Create a Project Description component for student mobile project description page
export default function ProjectDescription() {
  // useState Hook to manage student code input
  const [projectCode, onChangeProjectCode] = useState("");
  return (
    <View style={[styles.homeContainer]}>
      <header style={styles.header}>Citizen Science App</header>
      <main style={styles.main}>
        Project Description Page
        <div>Welcome to Project #1!</div>
        <Text>Hello students and welcome to week 1 of "Growing a Tree"!</Text>
        <Text>
          Week 1: To get started, we will quickly review our tree varieties from
          class...
        </Text>
        <Text>Week 2: This week you will...</Text>
      </main>
    </View>
  );
}

// Style student project description page elements with StyleSheet import
const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: "#dcd5be",
    minHeight: "100%",
  },
  header: {
    backgroundColor: "#a368eb",
    fontSize: 40,
    color: "#ffffff",
    textAlign: "center",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 10,
    fontSize: 30,
    gap: 20,
  },
});
