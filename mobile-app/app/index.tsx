import { Image, StyleSheet, TextInput, Text, Button, View } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useProject } from "./ProjectContext";
import { API_URL } from "../constants/api";

import { TouchableOpacity } from "react-native";

import globalStyles from "./styles/globalStyles";

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
    <View style={[globalStyles.homeContainer]}>
      <Text style={globalStyles.header}>Citizen Science App</Text>

      <Text style={globalStyles.subHead}>Project Code</Text>
      {error && <Text style={globalStyles.error}>{error}</Text>}

      <TextInput
        style={globalStyles.input}
        onChangeText={onChangeProjectCode}
        value={projectCode}
        placeholder="Enter Code Here!"
        keyboardType="default"
      />

      <TouchableOpacity style={globalStyles.button} onPress={enterCode}>
      <Text style={globalStyles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <Image
        style={globalStyles.image}
        source={require("@/assets/images/science-image.webp")}
      />

    </View>
  );
}
