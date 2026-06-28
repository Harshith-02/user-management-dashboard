import React, { useState, useEffect, useRef } from 'react';
import { DEPARTMENTS } from '../utils/constants';

/**
 * FilterPopup Component
 * Displays a popup containing filter input fields.
 * Maintains local temporary state, applying filters on click of "Apply".
 */
export default function FilterPopup({ activeFilters, onApplyFilters, onResetFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...activeFilters });
  const popupRef = useRef(null);

  // Sync local filters when active filters change
  useEffect(() => {
    setLocalFilters({ ...activeFilters });
  }, [activeFilters]);

  // Close popup if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const emptyFilters = {
      firstName: '',
      lastName: '',
      email: '',
      department: ''
    };
    setLocalFilters(emptyFilters);
    onResetFilters();
    setIsOpen(false);
  };

  const activeFiltersCount = Object.values(activeFilters).filter(val => val !== '').length;

  return (
    <div className="filter-controls" ref={popupRef}>
      <button 
        className={`btn btn-secondary btn-filter-toggle ${activeFiltersCount > 0 ? 'active' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Toggle filter settings"
      >
        <span>⚙</span> Filters
        {activeFiltersCount > 0 && (
          <span className="filter-badge" aria-label={`${activeFiltersCount} filters active`}>
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="filter-popup-card glass-panel" role="dialog" aria-label="Filter parameters">
          <div className="filter-popup-header">
            <h3>Filter Parameters</h3>
            <button 
              className="modal-close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close filters"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleApply}>
            <div className="filter-popup-body">
              <div className="form-group">
                <label htmlFor="filter-firstname">First Name</label>
                <input
                  id="filter-firstname"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Leanne"
                  value={localFilters.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="filter-lastname">Last Name</label>
                <input
                  id="filter-lastname"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Graham"
                  value={localFilters.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="filter-email">Email</label>
                <input
                  id="filter-email"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sincere@"
                  value={localFilters.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="filter-dept">Department</label>
                <select
                  id="filter-dept"
                  className="form-select"
                  value={localFilters.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="filter-popup-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleReset}
              >
                Reset
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
