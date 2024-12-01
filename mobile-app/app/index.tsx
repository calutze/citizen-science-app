import { Image, StyleSheet, TextInput, Text, Button, View } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useProject } from "./ProjectContext";
import { API_URL } from "../constants/api";

import { TouchableOpacity } from "react-native";

// Create a HomeScreen component for student mobile landing page
export default function HomeScreen() {
  // Hooks for student code input, projectID, errors, and router
  const [projectCode, onChangeProjectCode] = useState("");
  const { setProjectId, error: projectError } = useProject();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function checkSession() {
    try {
      const response = await fetch(
        `${API_URL}/check-session`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();

      if (data.session_active) {
        setProjectId(data.project_id);
        router.push({
          pathname: `/(tabs)/project-description`,
        });
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

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

      <Text style={styles.subHead}>Project Code</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        onChangeText={onChangeProjectCode}
        value={projectCode}
        placeholder="Enter Code Here!"
        keyboardType="default"
      />

      <TouchableOpacity style={styles.button} onPress={enterCode}>
      <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

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
    color: "#993323",
    fontSize: 18,
    fontWeight: "bold",
  },
  homeContainer: {
    backgroundColor: "#dcd5be",
    minHeight: "100%",
    alignItems: "center",
    display: "flex",
    gap: 12,
  },
  header: {
    backgroundColor: "#a368eb",
    fontSize: 40,
    color: "#ffffff",
    textAlign: "center",
    width: "100%",
    padding: 10,
    paddingBottom: 12,
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
  subHead: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 20,
  },
  input: {
    height: 50,
    margin: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    maxWidth: 300,
    width: "100%",
    backgroundColor: "#ffffff",
    textAlign: "center",
    fontSize: 18,
  },
  image: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#a368eb",
    paddingVertical: 14, 
    paddingHorizontal: 26,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 22, 
    fontWeight: "500", 
    textAlign: "center",
  },
});
