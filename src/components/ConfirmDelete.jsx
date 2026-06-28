import React, { useEffect, useRef } from 'react';

/**
 * ConfirmDelete Component
 * Safety modal prompt preventing accidental user deletion.
 */
export default function ConfirmDelete({ isOpen, user, onConfirm, onCancel, isDeleting }) {
  const cancelBtnRef = useRef(null);

  // Focus the cancel button on mount for safety
  useEffect(() => {
    if (isOpen && cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key to cancel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <h2 id="delete-title" style={{ color: 'var(--danger)' }}>Confirm Deletion</h2>
          <button 
            className="modal-close-btn" 
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Cancel deletion"
          >
            ×
          </button>
        </div>
        
        <div className="delete-warning-message">
          Are you sure you want to permanently delete the profile for{' '}
          <span className="delete-target-name">
            {user.firstName} {user.lastName}
          </span>
          ? This action will remove their record from the directory index.
        </div>

        <div className="delete-caution" aria-live="polite">
          <span style={{ fontSize: '1.25rem' }}>⚠</span>
          <div>
            <strong>Warning:</strong> This simulation removes the user from the local state list immediately.
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
            ref={cancelBtnRef}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(user.id)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
