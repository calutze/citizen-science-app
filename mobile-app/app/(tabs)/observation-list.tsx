import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";
import { useProject } from "../ProjectContext";
import { API_URL } from "@/constants/api";

type ObservationValue = {
    observation_value_id: number;
    field: number;
    value: string;
};

type Observation = {
    observation_id: number;
    created_at: string;
    observation_values: ObservationValue[];
};

interface DisplayObservationsProps {
    observations: Observation[];
}
// Create a Project Description component for student mobile project description page
export default function ProjectDescription() {
  const { projectId } = useProject();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [title, setTitle] = useState();

  async function getObservations() {
    const formHeader = new Headers();
    formHeader.append("Content-Type", "application/json");
    const observationRequest = new Request(
      `${API_URL}/show-observations/` + projectId,
      {
        method: "GET",
        credentials: "include",
        headers: formHeader,
      }
    );

    try {
      const response = await fetch(observationRequest);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const data = await response.json();
        setObservations(data.observations);
        setTitle(data.project.title);
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }
  useEffect(() => {getObservations()}, []);

  return (
    <View style={[styles.homeContainer]}>
      <Text style={styles.header}>Citizen Science App</Text>
      <Text style={styles.text1}>{title && title}</Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Observation ID</DataTable.Title>
          <DataTable.Title>Created At</DataTable.Title>
          <DataTable.Title>Details</DataTable.Title>
        </DataTable.Header>
        {observations && observations.map((observation: Observation) => (
            <DataTable.Row key={observation.observation_id}>
                <DataTable.Cell>{observation.observation_id}</DataTable.Cell>
                <DataTable.Cell>
                    {new Date(observation.created_at).toLocaleString()}
                </DataTable.Cell>
                <DataTable.Cell>
                    {observation.observation_values
                    .map((value) => `${value.value}`)
                    .join(", ")}
                </DataTable.Cell>
            </DataTable.Row>
        ))}
      </DataTable>
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
