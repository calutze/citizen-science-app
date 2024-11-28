import { Image, StyleSheet, TextInput, Text, Button, View } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useProject } from "./ProjectContext";
import { API_URL } from "../constants/api";

// Create a HomeScreen component for student mobile landing page
export default function HomeScreen() {
  // Hooks for student code input, projectID, errors, and router
  const [projectCode, onChangeProjectCode] = useState("");
  const { setProjectId, error: projectError } = useProject();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use /enter-code endpoint to verify student project code and redirect to project page
  async function enterCode() {
    try {
      setError(null);
      const projectHeader = new Headers();
      projectHeader.append("Content-Type", "application/json");
      let projectRequest = new Request(
        `${API_URL}/enter-code`,
        {
          credentials: "include",
          method: "POST",
          headers: projectHeader,
          body: JSON.stringify({ code: projectCode }),
        }
      );
      const response = await fetch(projectRequest);

      if (!response.ok) {
        setError("That project does not exist.");
        return;
      }

      const data = await response.json();
      console.log(data);
      setProjectId(data.project_id);

      router.push({
        pathname: `/(tabs)/project-description`,
      });
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }}

  useEffect(() => {
    if (projectError) {
      setError(projectError);
    }
  }, [projectError]);

  return (
    // organize and structure student mobile landing page with text input for project code (TextInput)
    <View style={[styles.homeContainer]}>
      <Text style={styles.header}>Citizen Science App</Text>
      <Text style={styles.text1}>Student Project Code:</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        onChangeText={onChangeProjectCode}
        value={projectCode}
        placeholder="Enter Student Project Code Here!"
        keyboardType="default"
      />
      <Button
        onPress={enterCode}
        title="Submit"
        color="#a368eb"
      />
      <Image
        style={styles.image}
        source={require("@/assets/images/science-image.webp")}
      />
    </View>
  );
}

// Style student landing page elements with StyleSheet import
const styles = StyleSheet.create({
  error: {
    color: "red",
  },
  homeContainer: {
    backgroundColor: "#dcd5be",
    minHeight: "100%",
    alignItems: "center",
    display: "flex",
    gap: 20,
  },
  header: {
    backgroundColor: "#a368eb",
    fontSize: 40,
    color: "#ffffff",
    textAlign: "center",
    width: "100%",
  },
  title: {
    fontSize: 32,
    marginTop: 24,
    marginBottom: 10,
    textAlign: "center",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 10,
    fontSize: 30,
    gap: 10,
  },
  input: {
    height: 30,
    margin: 5,
    borderWidth: 1,
    padding: 0,
    maxWidth: 250,
    width: "100%",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  image: {
    width: "100%",
    minWidth: 0,
    maxWidth: 250,
    maxHeight: 250,
    marginTop: 20
  },
  text1: {
    fontWeight: "bold",
  },
});
