import axios from "axios";
import { API_BASE_URL } from "../config";

export async function addFaceRegister({ eventID, photo }) {
  try {
    const formData = new FormData();
    formData.append("Event_ID", eventID);
    formData.append("Photo", photo);

    const response = await axios.post(
      `${API_BASE_URL}/Helper/FaceDetection/addFace.php`,
      formData
    );

    if (response.data?.Status !== true) {
      throw new Error("Server returned an error status ");
    }
    return response.data;
  } catch (err) {
    console.error("Failed to Add Face Register for event:", err);
    throw err;
  }
}

export async function faceDetection({ eventID, photo }) {
  try {
    const formData = new FormData();
    formData.append("Event_ID", eventID);
    formData.append("Photo", photo);

    const response = await axios.post(
      `${API_BASE_URL}/Helper/FaceDetection/detectFace.php`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // if (response.data?.Status !== true) {
    //   throw new Error("Server returned an error status");
    // }
    return response.data;
  } catch (err) {
    console.error("Failed to upload Excel for event:", err);
    throw err;
  }
}
