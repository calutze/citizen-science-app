import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { API_URL } from "@/constants/api";

interface ProjectContextProps {
  projectId: number | null;
  setProjectId: (id: number) => void;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(
  undefined
);

interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [projectId, setProjectId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Check if a session is active and set the project id
  async function checkSession() {
    try {
      const response = await fetch(
        `${API_URL}/check-session`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();

      // If a session is active, set the project id and navigate to the project description page
      if (data.session_active) {
        setProjectId(data.project_id);
        router.push({
          pathname: `/(tabs)/project-description`,
        });
        
      } else {
        setProjectId(-1);
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
    <ProjectContext.Provider value={{ projectId, setProjectId, error }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

export default ProjectProvider;
