import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ProjectContextProps {
  projectId: string | null;
  setProjectId: (id: string) => void;
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
  const [projectId, setProjectId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

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
