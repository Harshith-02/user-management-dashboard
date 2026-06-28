import React from 'react';

/**
 * Header Component
 * Displays the dashboard branding, current statistics, and the primary Action button.
 */
export default function Header({ totalUsersCount, rawUsersCount, onAddUserClick }) {
  return (
    <header className="header-wrapper">
      <div className="header-branding">
        <h1>AdminPortal</h1>
        <p>Manage, audit, and configure user directory profiles from a mock REST database.</p>
      </div>
      <div className="header-actions">
        <div className="user-count-badge">
          Total Users: <span className="user-count-num">{totalUsersCount}</span>
          {rawUsersCount !== totalUsersCount && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> (of {rawUsersCount})</span>
          )}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={onAddUserClick}
          aria-label="Add New User"
        >
          <span>+</span> Add User
        </button>
      </div>
    </header>
  );
}
