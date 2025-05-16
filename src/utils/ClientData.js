import axios from 'axios';
import { API_BASE_URL } from '../config';





export async function getUserDataByClient() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Client/user.php`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          Event_ID: localStorage.getItem('eventId') || null,
        },
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


export async function deleteUserDataClient(userID) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/Client/user.php`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        data: {
          User_ID: userID,
          Event_ID: localStorage.getItem('eventId') || null,
        }
      }
    );


    if (response.data?.Status !== true) {
      throw new Error("Server returned an error status");
    }

    return response.data;

  } catch (err) {
    console.error("Failed to delete user data : ", err);
    throw err;
  }
}

export async function editUserDataClient(userData) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Client/user.php`,
      userData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      }
    );
    if (response.data?.Status !== true) {
      throw new Error("Server returned an error status");
    }
    return response.data;
  } catch (err) {
    console.error("Failed to edit user data:", err);
    throw err;
  }
}



export async function getSpecificUserData(userID) {
  try {
    const response = await axios.get(`${API_BASE_URL}/Client/user.php`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      params: {
        User_ID: userID,
        Event_ID: localStorage.getItem('eventId'),
      },
    });

    if (response.data?.Status !== true) {
      throw new Error(response.data?.Message || "Server returned an error status");
    }
    return response.data.Data;
  } catch (err) {
    console.error("Failed to fetch specific user data:", err);
    throw err;
  }
}




export async function uploadEventExcel({ eventID, excelFile }) {
  // eventID: string or number
  // excelFile: File object (e.g. from an <input type="file">)
  try {
    const formData = new FormData();
    formData.append('Event_ID', eventID);
    formData.append('excelFile', excelFile);

    const response = await axios.post(
      `${API_BASE_URL}/Helper/exceltodatabase.php`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      }
    );

    if (response.data?.Status !== true) {
      throw new Error("Server returned an error status");
    }
    return response.data;

  } catch (err) {
    console.error("Failed to upload Excel for event:", err);
    throw err;
  }
}


export async function userScanner(userID) {
  try {
    const response = await axios.get(`${API_BASE_URL}/Client/scanner.php`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      params: {
        User_ID: userID,
      },
    });

    if (response.data?.Status !== true) {
      throw new Error(response.data?.Message || "Server returned an error status");
    }
    return response.data;
  } catch (err) {
    console.error("Failed to Scan User :", err);
    throw err;
  }
}


// ClientData.js
export async function uploadBackgroundImages({ eventID, img1, img2, img3 }) {
  const formData = new FormData();
  formData.append('Event_ID', eventID);
  formData.append('image1', img1);
  formData.append('image2', img2);
  formData.append('image3', img3);

  const response = await axios.post(
    `${API_BASE_URL}/Client/uploadBackground.php`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    }
  );

  if (!response.data?.Status) {
    throw new Error(response.data?.Message || "Server error");
  }
  return response.data;
}
