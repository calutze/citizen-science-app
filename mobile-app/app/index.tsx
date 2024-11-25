import { Image, StyleSheet, TextInput, Text, Button } from "react-native";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { Link, router, useRouter } from "expo-router";
import { useProject } from "./ProjectContext";
// import { useNavigation } from "@react-navigation/native";

// Create a HomeScreen component for student mobile landing page
export default function HomeScreen() {
  // useState Hook for student code input
  const [projectCode, onChangeProjectCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setProjectId } = useProject();
  const router = useRouter();
  // const navigation = useNavigation();
  async function checkSession() {
    try {
      const response = await fetch(
        `https://capstone-deploy-production.up.railway.app/check-session`,
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

  return (
    // organize and structure student mobile landing page with text input for project code (TextInput)
    <View style={[styles.homeContainer]}>
      <Text style={styles.header}>Citizen Science App</Text>
      <Text>Student Project Code:</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        onChangeText={onChangeProjectCode}
        value={projectCode}
        placeholder="Enter Student Project Code Here!"
        keyboardType="default"
      />
      <Button
        onPress={async () => {
          try {
            setError(null);
            const projectHeader = new Headers();
            projectHeader.append("Content-Type", "application/json");
            let projectRequest = new Request(
              "https://capstone-deploy-production.up.railway.app/enter-code",
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
    padding: 0,
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
