import { Image, StyleSheet, TextInput, Text, Button } from "react-native";
import { View } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
// import { useNavigation } from "@react-navigation/native";

// Create a HomeScreen component for student mobile landing page
export default function HomeScreen() {
  // useState Hook for student code input
  const [projectId, onChangeProjectId] = useState("");
  const [error, setError] = useState<string | null>(null);
  // const navigation = useNavigation();

  return (
    // organize and structure student mobile landing page with text input for project code (TextInput)
    <View style={[styles.homeContainer]}>
      <Text style={styles.header}>Citizen Science App</Text>
      <Text>Student Project ID:</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        onChangeText={onChangeProjectId}
        value={projectId}
        placeholder="Enter Student Project ID Here!"
        keyboardType="default"
      />
      <Button
        onPress={async () => {
          try {
            setError(null);

            const response = await fetch(
              `https://capstone-deploy-production.up.railway.app/project/${projectId}`,
              {
                credentials: "include",
                method: "GET",
              }
            );

            if (!response.ok) {
              setError("That project does not exist.");
              return;
            }

            const data = await response.json();

            router.push({
              pathname: `/project-description`,
              params: { id: data.project.project_id },
            });
          } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
          }
        }}
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
  },
  input: {
    height: 30,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    maxWidth: 250,
    width: "100%",
  },
  image: {
    width: "100%",
    minWidth: 0,
    maxWidth: 250,
    maxHeight: 250,
  },
});
