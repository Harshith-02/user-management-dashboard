import React from 'react';

/**
 * SearchBar Component
 * Renders a stylized input with a search icon and a clear button.
 */
export default function SearchBar({ searchQuery, onSearchChange }) {
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="search-container">
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search users"
      />
      {searchQuery && (
        <button 
          className="search-clear-btn" 
          onClick={handleClear}
          title="Clear search"
          aria-label="Clear search query"
        >
          ×
        </button>
      )}
    </div>
  );
}
