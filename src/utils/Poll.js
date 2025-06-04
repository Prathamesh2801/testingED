import axios from "axios";
import { API_BASE_URL } from "../config";

export const fetchAllPolls = async (eventId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const resp = await axios.get(`${API_BASE_URL}/Client/polls.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: { Event_ID: eventId },
    });
    console.log("response in polls Api : ", resp);
    if (resp.data.Status) return resp.data.Data;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error fetching polls data :", err);
    throw err;
  }
};

export const createPoll = async (eventId, question, optionsArray) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    if (!Array.isArray(optionsArray) || optionsArray.length < 2) {
      throw new Error("At least two options are required.");
    }

    const formData = new FormData();
    formData.append("Event_ID", eventId);
    formData.append("Question", question);
    formData.append("Options", JSON.stringify(optionsArray));

    const response = await axios.post(
      `${API_BASE_URL}/Client/polls.php`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Create Poll Response:", response.data);

    if (response.data.Status) {
      return response.data;
    } else {
      throw new Error(response.data.Message || "Poll creation failed");
    }
  } catch (err) {
    console.error("Error creating poll:", err);
    throw err;
  }
};

export const deleteSpecificPoll = async (eventId, pollId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const resp = await axios.delete(`${API_BASE_URL}/Client/polls.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: { Event_ID: eventId, Poll_ID: pollId },
    });
    console.log("response in polls Api : ", resp);
    if (resp.data.Status) return resp.data.Data;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error fetching polls data :", err);
    throw err;
  }
};

// New API function to get specific poll data
export const fetchSpecificPoll = async (eventId, pollId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const resp = await axios.get(`${API_BASE_URL}/Client/polls.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: { Event_ID: eventId, Poll_ID: pollId },
    });
    console.log("response in specific poll Api : ", resp);
    if (resp.data.Status) return resp.data.Data;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error fetching specific poll data :", err);
    throw err;
  }
};

// New API function to update poll status (Live/Inactive)
export const updatePollStatus = async (eventId, pollId, liveStatus) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const data = {
      Event_ID: eventId,
      Poll_ID: pollId,
      Live: liveStatus.toString(), // or just `liveStatus` if it's already a string or boolean
    };

    const response = await axios.put(
      `${API_BASE_URL}/Client/polls.php`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // 👈 Important!
        },
      }
    );

    console.log("Update Poll Status Response:", response.data);

    if (response.data.Status) {
      return response.data;
    } else {
      throw new Error(response.data.Message || "Poll status update failed");
    }
  } catch (err) {
    console.error("Error updating poll status:", err);
    throw err;
  }
};


// New API function to update complete poll data
export const updatePoll = async (eventId, pollId, question, optionsArray, liveStatus) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    if (!Array.isArray(optionsArray) || optionsArray.length < 2) {
      throw new Error("At least two options are required.");
    }

    const data = {
      Event_ID: eventId,
      Poll_ID: pollId,
      Question: question,
      Options: optionsArray, // send as array, not stringified
      Live: liveStatus.toString(), // or just `liveStatus` if boolean is accepted
    };

    const response = await axios.put(
      `${API_BASE_URL}/Client/polls.php`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Important
        },
      }
    );

    console.log("Update Poll Response:", response.data);

    if (response.data.Status) {
      return response.data;
    } else {
      throw new Error(response.data.Message || "Poll update failed");
    }
  } catch (err) {
    console.error("Error updating poll:", err);
    throw err;
  }
};
