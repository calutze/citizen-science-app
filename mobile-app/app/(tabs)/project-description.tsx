import { useEffect, useState } from "react";
import { Text, ScrollView, View } from "react-native";
import { useProject } from "../ProjectContext";
import { API_URL } from "@/constants/api";
import globalStyles from "../styles/globalStyles";

// Create a Project Description component for student mobile project description page
export default function ProjectDescription() {
  const [error, setError] = useState<string | null>(null);
  const { projectId } = useProject();
  const [project, setProject] = useState<any | null>(null);

  // Fetch project data from the backend
  async function getProject(id: number | null) {
    try {
      const response = await fetch(
        `${API_URL}/project/${id}`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setProject(data.project);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    if (projectId) {
      getProject(projectId);
    }
  }, [projectId]);

  return (
    <View style={[globalStyles.projectContainer]}>
      <Text style={globalStyles.header}>Citizen Science App</Text>
      
      {error && <Text style={globalStyles.error}>{error}</Text>}

      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        {error && <Text style={globalStyles.error}>{error}</Text>}

        <Text style={[globalStyles.title, { paddingLeft: 20 }]}>Project</Text>
        <Text style={globalStyles.projectHeadline}>{project && project.title}</Text>
        <Text style={globalStyles.projectText}>{project && project.description}</Text>
        <Text style={globalStyles.projectSubhead}>Instructions</Text>
        <Text style={globalStyles.projectText}>{project && project.instructions}</Text>
        <Text style={globalStyles.explanation}>
          Click the "New Observation" icon below to make an observation.
        </Text>
      </ScrollView>
    </View>
  );
}
