import { View, StyleSheet, Text } from "react-native";
import DynamicForm from "@/components/DynamicForm";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useProject } from "../ProjectContext";

export default function FormScreen() {
  const sampleFormData = {
    form_id: 1,
    description: "Sample form description",
    project_id: 123,
    fields: [
      {
        field_id: 1,
        field_title: "Full Name",
        field_type: "TextInput",
        field_description: "Enter your full name",
        field_order: 1,
        field_options: null,
        is_required: true,
      },
      {
        field_id: 2,
        field_title: "Sample Secure Input",
        field_type: "TextInput",
        field_description: "Enter your secure text",
        field_order: 2,
        field_options: null,
        is_required: true,
      } /*,
      {
        field_id: 3,
        field_title: 'Switch',
        field_type: 'Switch',
        field_description: '',
        field_order: 3,
        field_options: null,
        is_required: false
      },
      {
        field_id: 4,
        field_title: 'User Type',
        field_type: 'Select',
        field_description: '',
        field_order: 4,
        field_options: ['Personal', 'Business'],
        is_required: true
      },
      {
        field_id: 6,
        field_title: 'Sample Checkbox',
        field_type: 'Checkbox',
        field_description: '',
        field_order: 6,
        field_options: null,
        is_required: false
      },
      {
        field_id: 7,
        field_title: 'Sample 3',
        field_type: 'TextInput',
        field_description: 'Enter your full name',
        field_order: 7,
        field_options: null,
        is_required: true
      },
      {
        field_id: 8,
        field_title: 'Something',
        field_type: 'TextInput',
        field_description: 'Enter your email',
        field_order: 8,
        field_options: null,
        is_required: true
      },
      {
        field_id: 9,
        field_title: 'Radio Buttons Group',
        field_type: 'RadioButton',
        field_description: '',
        field_order: 9,
        field_options: ['Option 1', 'Option 2', 'Option 3'],
        is_required: true
      }*/,
    ],
  };
  const { projectId } = useProject();

  // Post formJSON to the backend to create a new form
  async function fetchForm() {
    const formHeader = new Headers();
    formHeader.append("Content-Type", "application/json");
    const formRequest = new Request(
      `https://capstone-deploy-production.up.railway.app/form/${projectId}`,
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
      "https://capstone-deploy-production.up.railway.app/add-observation",
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

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchForm().then((data) => {
      setFormData(data);
    });
  }, [formData]);

  function handleSubmit(values: any) {
    postForm(values).then((data) => {
      console.log(data);
    });
    // Handle form submission here
    router.push({
      pathname: `/(tabs)/project-description`,
    });
  }

  return (
    <View>
      <Text style={styles.header}>Citizen Science App</Text>
      <DynamicForm
        formData={formData || sampleFormData}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header2: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});
