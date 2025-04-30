import axios from 'axios';
import { API_BASE_URL } from '../config';



export async function getUserDataByEventID(eventID) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Client/user.php`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          Event_ID: eventID,
        }
      }
    );
    if (response.data?.Status !== true) {
      throw new Error("Server returned an error status");
    }

    return response.data.Data;

  } catch (err) {
    console.error("Failed to fetch user data by Event_ID:", err);
    throw err;
  }
}

export async function getUserDataByClient() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Client/user.php`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      }
    );
    if (response.data?.Status !== true) {
      throw new Error("Server returned an error status");
    }

    return response.data.Data;

  } catch (err) {
    console.error("Failed to fetch user data : ", err);
    throw err;
  }
}
