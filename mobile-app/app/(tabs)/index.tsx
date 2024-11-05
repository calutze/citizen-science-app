import { Image, StyleSheet, TextInput } from "react-native";
import { View } from "react-native";
import { useState } from "react";

export default function HomeScreen() {
  const [projectCode, onChangeProjectCode] = useState("");
  return (
    <View style={[styles.homeContainer]}>
      <header style={styles.header}>Citizen Science App</header>
      <main style={styles.main}>
        Student Project Code:
        <TextInput
          style={styles.input}
          onChangeText={onChangeProjectCode}
          value={projectCode}
          placeholder="Enter Student Project Code Here!"
          keyboardType="default"
        />
        <Image
          style={styles.image}
          source={require("@/assets/images/science-image.webp")}
        />
      </main>
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: "#dcd5be",
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
    fontSize: 20,
  },
  input: {
    height: 30,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    maxWidth: 470,
    width: "100%",
  },
  image: {
    width: "100%",
    minWidth: 0,
  },
});
