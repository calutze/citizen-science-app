import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useProject } from "../ProjectContext";
import { API_URL } from "@/constants/api";

// Call the clean-session endpoint to end the session and return to the index page
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
