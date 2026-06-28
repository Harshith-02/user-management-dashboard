import React from 'react';

/**
 * UserRow Component
 * Renders a single table row for a user.
 */
export default function UserRow({ user, onEditClick, onDeleteClick }) {
  // Safe mapping of department name to CSS class
  const deptClass = (user.department || '')
    .toLowerCase()
    .replace(/\s+/g, '-');

  return (
    <tr>
      <td>
        <span className="user-id">#{user.id}</span>
      </td>
      <td className="user-name-bold">{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>
        <span className="user-email">{user.email}</span>
      </td>
      <td>
        <span className={`dept-badge ${deptClass}`}>
          {user.department}
        </span>
      </td>
      <td className="actions-cell">
        <button
          className="btn-icon-only edit-btn"
          onClick={() => onEditClick(user)}
          title="Edit Profile"
          aria-label={`Edit profile for ${user.firstName} ${user.lastName}`}
        >
          ✎
        </button>
        <button
          className="btn-icon-only delete-btn"
          onClick={() => onDeleteClick(user)}
          title="Delete Profile"
          aria-label={`Delete profile for ${user.firstName} ${user.lastName}`}
        >
          🗑
        </button>
      </td>
    </tr>
  );
}
