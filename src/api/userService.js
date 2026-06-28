import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

/**
 * Fetch all users from the mock API.
 * @returns {Promise<Array>} A promise resolving to the list of users.
 */
export const getUsers = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

/**
 * Send a POST request to simulate user creation.
 * @param {Object} userData - The new user's details.
 * @returns {Promise<Object>} The response data representing the created user.
 */
export const createUser = async (userData) => {
  // Combine firstName and lastName back into name for the mock API if needed,
  // or just send the object. JSONPlaceholder accepts arbitrary payloads.
  const payload = {
    name: `${userData.firstName} ${userData.lastName}`.trim(),
    email: userData.email,
    department: userData.department
  };
  const response = await axios.post(API_BASE_URL, payload);
  return response.data;
};

/**
 * Send a PUT request to simulate user updates.
 * @param {number|string} id - The user's ID.
 * @param {Object} userData - The updated user's details.
 * @returns {Promise<Object>} The response data representing the updated user.
 */
export const updateUser = async (id, userData) => {
  const payload = {
    id,
    name: `${userData.firstName} ${userData.lastName}`.trim(),
    email: userData.email,
    department: userData.department
  };
  const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
  return response.data;
};

/**
 * Send a DELETE request to simulate user deletion.
 * @param {number|string} id - The user's ID.
 * @returns {Promise<Object>} The API response.
 */
export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
