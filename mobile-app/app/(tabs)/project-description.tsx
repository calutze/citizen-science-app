import { Image, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useProject } from "../ProjectContext";

// Create a Project Description component for student mobile project description page
export default function ProjectDescription() {
  // useState Hook to manage student code input
  const [error, setError] = useState<string | null>(null);
  const { projectId } = useProject();
  const [project, setProject] = useState<any | null>(null);

  async function getProject(id: string | null) {
    try {
      const response = await fetch(
        `https://exquisite-vision-production.up.railway.app/project/${id}`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setProject(data.project);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    getProject(projectId);
  }, [projectId]);

  return (
    <View style={[styles.homeContainer]}>
      <Text style={styles.header}>Citizen Science App</Text>
      <Text>Project Description Page</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text>{project && project.title}</Text>
      <Text>Description:</Text>
      <Text>{project && project.description}</Text>
      <Text>Instructions:</Text>
      <Text>{project && project.instructions}</Text>
    </View>
  );
}

// Style student project description page elements with StyleSheet import
const styles = StyleSheet.create({
  error: {
    color: "red",
  },
  homeContainer: {
    backgroundColor: "#dcd5be",
    minHeight: "100%",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#a368eb",
    fontSize: 40,
    color: "#ffffff",
    textAlign: "center",
    width: "100%",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 10,
    fontSize: 30,
    gap: 20,
    maxWidth: 400,
  },
});
