import { DEPARTMENTS } from './constants';

/**
 * Splits a full name string into first name and last name.
 * Splits on the first space character.
 * @param {string} fullName - The full name string.
 * @returns {Object} An object containing firstName and lastName.
 */
export const splitFullName = (fullName = '') => {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: '', lastName: '' };
  }
  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: '' };
  }
  return {
    firstName: trimmed.substring(0, spaceIndex),
    lastName: trimmed.substring(spaceIndex + 1)
  };
};

/**
 * Assigns a department consistently based on the user's ID.
 * @param {number|string} id - The user ID.
 * @returns {string} The assigned department.
 */
export const getAssignedDepartment = (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    // Fallback if ID is not a number (e.g. uuid client-side)
    const hash = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return DEPARTMENTS[hash % DEPARTMENTS.length];
  }
  return DEPARTMENTS[numericId % DEPARTMENTS.length];
};

/**
 * Maps a raw API user object to our frontend schema.
 * @param {Object} apiUser - The user object from JSONPlaceholder.
 * @returns {Object} The mapped user object.
 */
export const mapApiUserToFrontend = (apiUser) => {
  const { firstName, lastName } = splitFullName(apiUser.name);
  return {
    id: apiUser.id,
    firstName,
    lastName,
    email: apiUser.email || '',
    department: apiUser.department || getAssignedDepartment(apiUser.id)
  };
};
