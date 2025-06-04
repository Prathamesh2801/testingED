import axios from "axios";
import { API_BASE_URL } from "../config";

export const fetchAllNotifications = async (eventId) => {
  try {
    const resp = await axios.get(
      `${API_BASE_URL}/Helper/Notification/notification.php`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: { Event_ID: eventId },
      }
    );
    console.log("response in notification Api : ", resp);
    if (resp.data.Status) return resp.data.Data;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error fetching notifications :", err);
    throw err;
  }
};
export const fetchSpecificNotifications = async (eventId, notificationId) => {
  try {
    const resp = await axios.get(
      `${API_BASE_URL}/Helper/Notification/notification.php`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: { Event_ID: eventId, Notification_ID: notificationId },
      }
    );
    console.log("response in notification Api : ", resp);
    if (resp.data.Status) return resp.data.Data;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error fetching notifications :", err);
    throw err;
  }
};

export const createNotifications = async ({
  eventId,
  title,
  message,
  type,
}) => {
  try {
    // 1. grab token
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    // 2. build FormData exactly like Postman form-data
    const fd = new FormData();
    fd.append("Event_ID", eventId);
    fd.append("Title", title);
    fd.append("Message", message);
    fd.append("Type", type);

    // 4. fire the POST—no explicit Content-Type header needed
    const resp = await axios.post(
      `${API_BASE_URL}/Helper/Notification/notification.php`,
      fd,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Create Notification response:", resp.data);
    if (resp.data.Status) return resp.data.Schedule_ID;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error adding Notifications :", err);
    throw err;
  }
};

export const editNotification = async ({
  eventId,
  title,
  message,
  type,
  notificationId,
}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const payload = {
      Event_ID: eventId,
      Title: title,
      Message: message,
      Type: type,
      Notification_ID: notificationId,
    };

    const response = await axios.put(
      `${API_BASE_URL}/Helper/Notification/notification.php`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Edit Notification response:", response.data);

    if (response.data.Status) {
      return response.data;
    } else {
      throw new Error(response.data.Message);
    }
  } catch (err) {
    console.error("Error editing notification:", err);
    throw err;
  }
};

export const deleteNotifications = async (eventId, notificationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    console.log("Notification Id  : ",notificationId)
    const resp = await axios.delete(
      `${API_BASE_URL}/Helper/Notification/notification.php`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { Event_ID: eventId, Notification_ID: notificationId },
      }
    );
    console.log("response in notification Api : ", resp);
    if (resp.data.Status) return resp.data.Data;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error Deleting notifications :", err);
    throw err;
  }
};
