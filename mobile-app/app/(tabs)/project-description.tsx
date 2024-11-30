import { StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { useProject } from "../ProjectContext";
import { API_URL } from "@/constants/api";

// Create a Project Description component for student mobile project description page
export default function ProjectDescription() {
  // useState Hook to manage student code input
  const [error, setError] = useState<string | null>(null);
  const { projectId } = useProject();
  const [project, setProject] = useState<any | null>(null);

  async function getProject(id: number | null) {
    try {
      const response = await fetch(
        `${API_URL}/project/${id}`,
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
    if (projectId) {
      getProject(projectId);
    }
  }, [projectId]);

  return (
    <View style={[styles.homeContainer]}>
      <Text style={styles.header}>Citizen Science App</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.text1}>Project Title:</Text>
      <Text>{project && project.title}</Text>
      <Text style={styles.text1}>Project Description:</Text>
      <Text>{project && project.description}</Text>
      <Text style={styles.text1}> Project Instructions:</Text>
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
    //alignItems: "center",
    gap: 10,
  },
  header: {
    backgroundColor: "#a368eb",
    fontSize: 40,
    color: "#ffffff",
    textAlign: "center",
    width: "100%",
  },
  header2: {
    fontSize: 25,
    textAlign: "center",
    width: "100%",
  },
  header3: {
    fontSize: 25,
    textAlign: "left",
    padding: 10,
  },
  paragraph: {
    fontSize: 14,
    textAlign: "left",
    width: "100%",
    padding: 10,
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
  text1: {
    fontWeight: "bold",
  },
});
