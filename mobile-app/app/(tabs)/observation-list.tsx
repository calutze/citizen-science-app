import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";
import { useProject } from "../ProjectContext";
import { API_URL } from "@/constants/api";

import globalStyles from "../styles/globalStyles";

type ObservationValue = {
  observation_value_id: number;
  value: string;
  form_field: {
    field_title: string;
  } | null;
};

type Observation = {
    observation_id: number;
    created_at: string;
    observation_values: ObservationValue[];
};

// Create a Observation List component for student mobile project description page
export default function ObservationList() {
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

    <View style={{ flex: 1 }}>
      <View style={globalStyles.headerContainer}>
        <Text style={globalStyles.header}>Citizen Science App</Text>
      </View>

      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <Text style={[globalStyles.title, { marginLeft: 20 }]}>{title}</Text>
        <View style={globalStyles.listContainer}>
          {observations.map((observation) => (
            <View key={observation.observation_id} style={globalStyles.card}>
              <Text style={globalStyles.cardHeader}>
                Observation ID: {observation.observation_id}
              </Text>
              <Text style={globalStyles.cardText}>
                Created At: {new Date(observation.created_at).toLocaleString()}
              </Text>

              <View style={{ marginTop: 10 }}>
                <Text style={globalStyles.cardHeader}>Details:</Text>
                {observation.observation_values.map((value) => (
                  <View key={value.observation_value_id} style={{ marginBottom: 8 }}>
                    <Text style={globalStyles.cardText}>
                      <Text style={{ fontWeight: "bold" }}>
                        {value.form_field?.field_title || "Unknown Field"}:{" "}
                      </Text>
                      {value.value}
                    </Text>
                  </View>
                ))}
              </View>
              
            </View>
          ))}
        </View>
      </ScrollView>
    </View>

  );


}
