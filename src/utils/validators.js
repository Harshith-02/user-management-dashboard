/**
 * Validates the user form data.
 * @param {Object} formData - The current state of the form fields.
 * @returns {Object} - An object containing field-specific errors, if any.
 */
export const validateUserForm = (formData) => {
  const errors = {};
  
  // First Name validation
  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = 'First Name is required.';
  } else if (!/^[A-Za-z\s\-']+$/.test(formData.firstName.trim())) {
    errors.firstName = 'First Name should only contain letters, spaces, hyphens, or apostrophes.';
  }

  // Last Name validation
  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = 'Last Name is required.';
  } else if (!/^[A-Za-z\s\-']+$/.test(formData.lastName.trim())) {
    errors.lastName = 'Last Name should only contain letters, spaces, hyphens, or apostrophes.';
  }

  // Email validation
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else {
    // Simple but robust email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  // Department validation
  if (!formData.department || !formData.department.trim()) {
    errors.department = 'Department selection is required.';
  }

  return errors;
};
