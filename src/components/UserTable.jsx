import React from 'react';
import UserRow from './UserRow';

/**
 * UserTable Component
 * Displays a list of user profiles in a responsive table.
 * Includes interactive column headers for sorting list elements.
 */
export default function UserTable({
  users,
  sortField,
  sortOrder,
  onSort,
  onEditClick,
  onDeleteClick
}) {
  // Utility to render sort indicator icons
  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <span className="sort-icon">⇅</span>;
    }
    return (
      <span className="sort-icon active">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  // If no users match current filters, show empty state
  if (users.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <span className="empty-state-icon" aria-hidden="true">👤</span>
        <h3>No Profiles Found</h3>
        <p>No user directory entries matched the current query or active filter settings. Try resetting parameters or adding a new profile.</p>
      </div>
    );
  }

  return (
    <div className="table-container glass-panel">
      <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => onSort('id')} style={{ width: '80px' }} scope="col">
              <div className="th-content">
                ID {renderSortIndicator('id')}
              </div>
            </th>
            <th onClick={() => onSort('firstName')} scope="col">
              <div className="th-content">
                First Name {renderSortIndicator('firstName')}
              </div>
            </th>
            <th onClick={() => onSort('lastName')} scope="col">
              <div className="th-content">
                Last Name {renderSortIndicator('lastName')}
              </div>
            </th>
            <th onClick={() => onSort('email')} scope="col">
              <div className="th-content">
                Email Address {renderSortIndicator('email')}
              </div>
            </th>
            <th onClick={() => onSort('department')} style={{ width: '220px' }} scope="col">
              <div className="th-content">
                Department {renderSortIndicator('department')}
              </div>
            </th>
            <th className="actions-header" style={{ width: '100px' }} scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
