import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import DynamicForm from "@/components/DynamicForm";
import { useProject } from "../ProjectContext";
import { API_URL } from "@/constants/api";
import globalStyles from "../styles/globalStyles";

export default function FormScreen() {
  const sampleFormData = {
    form_id: -1,
    description: "Sample form description",
    project_id: 123,
    fields: [
      {
        field_id: -1,
        field_title: "Full Name",
        field_type: "TextInput",
        field_description: "Enter your full name",
        field_order: 1,
        field_options: null,
        is_required: true,
      }
    ],
  };
  const { projectId } = useProject();
  const [formData, setFormData] = useState();

  // Post formJSON to the backend to create a new form
  async function fetchForm() {
    console.log(`Fetching form for project ${projectId}`);
    const formHeader = new Headers();
    formHeader.append("Content-Type", "application/json");
    const formRequest = new Request(
      `${API_URL}/form/${projectId}`,
      {
        method: "GET",
        credentials: "include",
        headers: formHeader,
      }
    );

    try {
      const response = await fetch(formRequest);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const formData = await response.json();
        return formData;
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }

  async function postForm(formJSON: any) {
    const formHeader = new Headers();
    formHeader.append("Content-Type", "application/json");
    const formRequest = new Request(
      `${API_URL}/add-observation`,
      {
        method: "POST",
        credentials: "include",
        headers: formHeader,
        body: JSON.stringify(formJSON, null, 2),
      }
    );

    try {
      const response = await fetch(formRequest);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const result = await response.json();
        return result;
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }

  useEffect(() => {
    fetchForm().then((data) => {
      setFormData(data);
    });
  }, []);

  function handleSubmit(values: any) {
    postForm(values);
    router.push({
      pathname: `/(tabs)/project-description`,
    });
  }

  return (
    <View style={globalStyles.homeContainer}>
      <Text style={globalStyles.header}>Citizen Science App</Text>
      <DynamicForm
        formData={formData || sampleFormData}
        onSubmit={handleSubmit}
      />
    </View>
  );
}
