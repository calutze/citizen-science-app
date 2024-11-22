import { Image, StyleSheet, TextInput, Text, Button } from "react-native";
import { View } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";

// Create a HomeScreen component for student mobile landing page
export default function HomeScreen() {
  // useState Hook for student code input
  const [projectCode, onChangeProjectCode] = useState("");
  const navigation = useNavigation();
  return (
    // organize and structure student mobile landing page with text input for project code (TextInput)
    <View style={[styles.homeContainer]}>
      <Text style={styles.header}>Citizen Science App</Text>
      <Text>Student Project Code:</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeProjectCode}
        value={projectCode}
        placeholder="Enter Student Project Code Here!"
        keyboardType="default"
      />
      <Button
        onPress={async () => {
          const response = await fetch(
            "https://capstone-deploy-production.up.railway.app/access-project",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ project_code: projectCode }),
            }
          );
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
