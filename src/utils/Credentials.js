import qs from "qs";
import axios from "axios";
import { API_BASE_URL } from "../config";

export async function getAllCredentials() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Admin/client.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data?.Status !== true) {
      throw new Error("Server returned an error status");
    }

    return response.data.Data;
  } catch (err) {
    console.error("Failed to fetch credentials:", err);
    throw err;
  }
}

export async function createCredential({ username, password, role, eventId }) {
  try {
    const formData = qs.stringify({
      Username: username,
      Password: password,
      Role: role,
      Event_ID:
        role === "Client" || role === "Scanner" || role === "faceDetect"
          ? eventId
          : "",
    });

    const response = await axios.post(
      `${API_BASE_URL}/Admin/client.php`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data?.Status !== true) {
      throw new Error(response.data?.Message || "Failed to create credential");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating credential:", error);
    throw error;
  }
}

export async function deleteCredential(credentialId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Admin/client.php`, {
      params: {
        Username: credentialId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data?.Status !== true) {
      throw new Error("Failed to delete credential");
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting credential:", error);
    throw error;
  }
}
