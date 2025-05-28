import axios from "axios";
import { API_BASE_URL } from "../config";

export const fetchScheduleAdmin = async (eventId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const resp = await axios.get(`${API_BASE_URL}/Client/schedule.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: { Event_ID: eventId },
    });
    console.log("response in Schedule Api : ", resp);
    if (resp.data.Status) return resp.data.Data;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error fetching schedules (admin):", err);
    throw err;
  }
};

export const createSchedule = async ({
  eventId,
  title,
  startDate,
  endDate,
  startTime,
  endTime,
  location = "",
  speaker = "",
}) => {
  try {
    // 1. grab token
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    // 2. build FormData exactly like Postman form-data
    const fd = new FormData();
    fd.append("Event_ID", eventId || localStorage.getItem("eventId"));
    fd.append("Title", title);
    fd.append("Start_Date", startDate);
    fd.append("End_Date", endDate);
    fd.append("Start_Time", startTime);
    fd.append("End_Time", endTime);
    fd.append("Location", location);
    fd.append("Speaker", speaker);

    // 3. optional: log out what you're actually sending
    for (let [key, val] of fd.entries()) {
      console.log("FD:", key, "=", val);
    }

    // 4. fire the POST—no explicit Content-Type header needed
    const resp = await axios.post(`${API_BASE_URL}/Client/schedule.php`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type' will be set to multipart/form-data; boundary=...
        Accept: "application/json",
      },
    });

    console.log("Create Schedule response:", resp.data);
    if (resp.data.Status) return resp.data.Schedule_ID;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error adding schedule:", err);
    throw err;
  }
};

export const deleteSchedule = async (eventId, scheduleId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const resp = await axios.delete(`${API_BASE_URL}/Client/schedule.php`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { Event_ID: eventId, Schedule_ID: scheduleId },
    });
    if (resp.data.Status) return true;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error deleting schedule:", err);
    throw err;
  }
};
