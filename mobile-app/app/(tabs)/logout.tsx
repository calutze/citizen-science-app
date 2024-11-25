import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useProject } from "../ProjectContext";

// Create a Project Description component for student mobile project description page
export default function Logout() {
  const router = useRouter()
  const { setProjectId } = useProject();

  async function performLogout() {
    const response = await fetch(
      `https://capstone-deploy-production.up.railway.app/clear-session`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    try {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      else {
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setProjectId(null);
          router.push({pathname: `/`,});
        }
        return data
      }
    }
    catch (error: any) {
      console.error('Error:', error.message);
    }
  }
  useEffect(() => { performLogout() }, []);
  return null;
}