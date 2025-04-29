import axios from 'axios';
import { API_BASE_URL } from '../config.js';


export const fetchEvents = async (eventId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/register.php`, {
            params: {
                Event_ID: eventId,
            }
        });
        console.log(response.data.Data);
        return response.data;


    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

export const registerEvent = async (eventId, formData) => {
    try {
        const formDataObj = new FormData();

        // Add Event_ID
        formDataObj.append('Event_ID', eventId);

        // Add all form fields with proper formatting
        Object.keys(formData).forEach(key => {
            const value = formData[key];

            // Handle file objects differently
            if (value instanceof File) {
                formDataObj.append(key, value);
            } else if (typeof value === 'number') {
                formDataObj.append(key, value.toString());
            } else if (value) { // Only append if value exists
                formDataObj.append(key, value);
            }
        });

        // Debug log
        for (let pair of formDataObj.entries()) {
            console.log('Sending:', pair[0], typeof pair[1] === 'object' ? 'File' : pair[1]);
        }

        const response = await axios.post(
            `${API_BASE_URL}/register.php`,
            formDataObj,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.data.Status) {
            return response.data;
        } else {
            throw new Error(response.data.Message || 'Registration failed');
        }
    } catch (error) {
        console.error('Server Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.Message || error.message || 'Registration failed');
    }
};



export const authLogin = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/log.php`,
            credentials,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        if (response.data.Status) {
            // Store token and role in localStorage
            localStorage.setItem('token', response.data.Token);
            localStorage.setItem('role', response.data.Role);
            if (response.data.Event_ID) {
                localStorage.setItem('eventId', response.data.Event_ID);
            }
            return response.data;
        } else {
            throw new Error(response.data.Message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.response?.data?.Message || error.message || 'Login failed');
    }
};

export const getAllEvents = async (page = 1, limit = 10) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${API_BASE_URL}/Admin/event.php`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                page,
                limit
            }
        });

        console.log('Raw API Response:', response.data); // Debug log

        if (response.data.Status) {
            return {
                events: response.data.Data || [],
                pagination: {
                    current_page: parseInt(response.data.Data.pagination.page || page),
                    per_page: parseInt(response.data.Data.pagination.limit || limit),
                    total: parseInt(response.data.Data.pagination.total || 0),
                    total_pages: parseInt(response.data.Data.pagination.total_pages || 1)
                }
            };
        } else {
            throw new Error(response.data.Message || 'Invalid response format');
        }
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            throw new Error('Session expired. Please login again.');
        }
        console.error('Error fetching events:', error);
        throw new Error(error.response?.data?.Message || error.message || 'Failed to fetch events');
    }
};




export const createEvent = async (eventData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }

        const formDataObj = new FormData();

        // Basic Event Info
        formDataObj.append("Event_Name", eventData.basicInfo.eventName);
        formDataObj.append("Event_Start_Date", eventData.basicInfo.startDate);
        formDataObj.append("Event_End_Date", eventData.basicInfo.endDate);

        // Event Logo
        if (eventData.basicInfo.eventLogo) {
            formDataObj.append("Event_Logo", eventData.basicInfo.eventLogo);
        }

        // Table Structure (Fields)
        formDataObj.append("Table_Structure", JSON.stringify(eventData.fields));

        // Communication Methods
        formDataObj.append("Event_IsEmail", eventData.communication.contactMethods.email ? "1" : "0");
        if (eventData.communication.contactMethods.email) {
            formDataObj.append("Event_Email_Column_Name", eventData.communication.contactMethods.emailField);
        }

        // WhatsApp Settings
        if (eventData.communication.contactMethods.whatsapp) {
            formDataObj.append("Event_WhatsApp_Template_ID",
                eventData.communication.contactMethods.whatsappTemplateId || "");
            formDataObj.append("Event_WhatsApp_Column_Name",
                eventData.communication.contactMethods.whatsappField || "");
        }

        // Additional Features
        formDataObj.append("Event_IsQuiz", eventData.communication.contactMethods.quiz ? "1" : "0");
        formDataObj.append("Event_IsPoll", eventData.communication.contactMethods.polls ? "1" : "0");
        formDataObj.append("Event_IsQRCode", eventData.communication.contactMethods.qrCode ? "1" : "0");
        formDataObj.append("Event_IsFaceRec", eventData.communication.contactMethods.faceRegistration ? "1" : "0");

        // Debug log the form data
        for (let pair of formDataObj.entries()) {
            console.log('Sending:', pair[0], typeof pair[1] === 'object' ? 'File' : pair[1]);
        }

        const response = await axios.post(
            `${API_BASE_URL}/Admin/event.php`,
            formDataObj,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            }
        );

        console.log('Raw API Response formDataObj in EventFetch:', formDataObj); // Debug log

        // Debug log for response
        console.log('Response headers:', response.headers);
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        if (response.data.Status) {
            return response.data;
        } else {
            throw new Error(response.data.Message || 'Event creation failed');
        }
    } catch (error) {
        // Improved error handling
        if (error.response?.status === 401) {
            localStorage.removeItem('token'); // Clear invalid token
            localStorage.removeItem('role');
            throw new Error('Session expired. Please login again.');
        }
        console.error("Could not create event:", error.response?.data || error);
        throw new Error(error.response?.data?.Message || error.message || 'Event creation failed');
    }
}

export const deleteEvent = async (eventId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }

        const response = await axios.delete(`${API_BASE_URL}/Admin/event.php`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                Event_ID: eventId,
            }
        });

        if (response.data.Status) {
            return response.data;
        } else {
            throw new Error(response.data.Message || 'Event deletion failed');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        throw new Error(error.response?.data?.Message || error.message || 'Event deletion failed');
    }
}


// Add this function to your EventFetchApi.js file


export const getEventById = async (eventId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Admin/event.php`,
      {
        params: { Event_ID: eventId },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    return response.data; 
  } catch (error) {
    if (error.response) {
      console.error('API error:', error.response.data);
      throw new Error(
        error.response.data.message || `Server Error (${error.response.status})`
      );
    } else {
      console.error('Network or CORS error:', error.message);
      throw new Error('Unable to reach server. Please try again later.');
    }
  }
};

