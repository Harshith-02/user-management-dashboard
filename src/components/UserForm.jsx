import React, { useState, useEffect, useRef } from 'react';
import { DEPARTMENTS } from '../utils/constants';
import { validateUserForm } from '../utils/validators';

/**
 * UserForm Component
 * Modal dialog for both Add User and Edit User profiles.
 * Features automated validation with inline error messaging.
 */
export default function UserForm({ isOpen, user, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Input refs for focus management
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const departmentRef = useRef(null);

  // Sync state when modal opens or user targets change
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          department: user.department || ''
        });
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          department: ''
        });
      }
      setErrors({});
      setTouched({});
      
      // Auto-focus first input field
      setTimeout(() => {
        if (firstNameRef.current) firstNameRef.current.focus();
      }, 50);
    }
  }, [isOpen, user]);

  // Handle ESC keyboard key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validate on the fly if the field has been touched
    if (touched[field]) {
      const validationErrors = validateUserForm({ ...formData, [field]: value });
      setErrors(prev => ({
        ...prev,
        [field]: validationErrors[field]
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationErrors = validateUserForm(formData);
    setErrors(prev => ({
      ...prev,
      [field]: validationErrors[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all as touched
    const allTouched = { firstName: true, lastName: true, email: true, department: true };
    setTouched(allTouched);
    
    const validationErrors = validateUserForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus first error element
      if (validationErrors.firstName && firstNameRef.current) firstNameRef.current.focus();
      else if (validationErrors.lastName && lastNameRef.current) lastNameRef.current.focus();
      else if (validationErrors.email && emailRef.current) emailRef.current.focus();
      else if (validationErrors.department && departmentRef.current) departmentRef.current.focus();
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  const isEditMode = !!user;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="form-title">{isEditMode ? 'Edit User Profile' : 'Register New User'}</h2>
          <button 
            className="modal-close-btn" 
            onClick={onCancel}
            disabled={isSaving}
            aria-label="Close form modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-form-fields">
            {/* First Name */}
            <div className="form-group">
              <label htmlFor="first-name">First Name *</label>
              <input
                id="first-name"
                type="text"
                ref={firstNameRef}
                className={`form-input ${errors.firstName ? 'invalid' : ''}`}
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                disabled={isSaving}
                required
              />
              {errors.firstName && <div className="form-error" role="alert">{errors.firstName}</div>}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label htmlFor="last-name">Last Name *</label>
              <input
                id="last-name"
                type="text"
                ref={lastNameRef}
                className={`form-input ${errors.lastName ? 'invalid' : ''}`}
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                disabled={isSaving}
                required
              />
              {errors.lastName && <div className="form-error" role="alert">{errors.lastName}</div>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                ref={emailRef}
                className={`form-input ${errors.email ? 'invalid' : ''}`}
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                disabled={isSaving}
                required
              />
              {errors.email && <div className="form-error" role="alert">{errors.email}</div>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                ref={departmentRef}
                className={`form-select ${errors.department ? 'invalid' : ''}`}
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                disabled={isSaving}
                required
              >
                <option value="" disabled>-- Select Department --</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <div className="form-error" role="alert">{errors.department}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Register User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
