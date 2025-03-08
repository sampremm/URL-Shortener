import axios from "axios";

const API_BASE_URL = import.meta.env.REACT_APP_API_URL; // Now points to "http://localhost:3000/url"

// Register user (with username)
export const registerUser = async ({ username, email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, { username, email, password });
    return response.data; // Axios automatically parses the response as JSON
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login user
export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data; // Axios automatically parses the response as JSON
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Shorten link
export const shortenLink = async ({ originalUrl, token }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/links/shorten`,
      { originalUrl },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Axios automatically parses the response as JSON
  } catch (error) {
    console.error("Error shortening link:", error);
    throw error;
  }
};

// Get user links
export const getUserLinks = async ({ token }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/links`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data; // Axios automatically parses the response as JSON
  } catch (error) {
    console.error("Error fetching user links:", error);
    throw error;
  }
};
