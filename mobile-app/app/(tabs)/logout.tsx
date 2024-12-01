import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useProject } from "../ProjectContext";
import { API_URL } from "@/constants/api";

// Create a Project Description component for student mobile project description page
export default function Logout() {
  const router = useRouter();
  const { setProjectId } = useProject();

  async function performLogout() {
    const response = await fetch(
      `${API_URL}/clear-session`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    try {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setProjectId(0);
          router.push({ pathname: `/` });
        }
        return data;
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }
  useEffect(() => {
    performLogout();
  }, []);
  return
}
