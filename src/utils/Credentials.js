import axios from "axios";
import { API_BASE_URL } from "../config";

export async function getAllCredentials() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Admin/client.php`,
      {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
      }
    );

    if (response.data?.Status !== true) {
      throw new Error("Server returned an error status");
    }

    return response.data.Data;
  } catch (err) {
    console.error("Failed to fetch credentials:", err);
    throw err;
  }
}
