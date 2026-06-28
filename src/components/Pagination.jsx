import React from 'react';
import { PAGE_LIMIT_OPTIONS } from '../utils/constants';

/**
 * Pagination Component
 * Renders page size selector, item range metrics, and navigation buttons.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItemsCount,
  itemsOnPageCount
}) {
  const fromIndex = totalItemsCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toIndex = Math.min(totalItemsCount, (currentPage - 1) * pageSize + itemsOnPageCount);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-wrapper">
      {/* Page Size Select */}
      <div className="pagination-size-select">
        <label htmlFor="page-size">Items per page:</label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          aria-label="Items per page"
        >
          {PAGE_LIMIT_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Page range metrics */}
      <div className="pagination-info">
        Showing <span style={{ fontWeight: 6 }}>{fromIndex}</span> – <span style={{ fontWeight: 6 }}>{toIndex}</span> of <span style={{ fontWeight: 6 }}>{totalItemsCount}</span> users
      </div>

      {/* Navigation Buttons */}
      <div className="pagination-buttons">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          title="Previous Page"
          aria-label="Previous Page"
        >
          ‹
        </button>

        {pageNumbers.map(page => (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}

        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          title="Next Page"
          aria-label="Next Page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
