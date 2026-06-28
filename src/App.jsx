import React, { useState } from 'react';
import { useUsers } from './hooks/useUsers';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterPopup from './components/FilterPopup';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';
import UserForm from './components/UserForm';
import ConfirmDelete from './components/ConfirmDelete';

export default function App() {
  const {
    users,
    totalUsersCount,
    rawUsersCount,
    loading,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sortField,
    sortOrder,
    handleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    addUser,
    editUser,
    deleteUser
  } = useUsers();

  // Modal Control States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formUser, setFormUser] = useState(null); // null = Add, userObj = Edit
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);
  
  const [isActionPending, setIsActionPending] = useState(false);

  // Form Save Handler
  const handleSaveUser = async (formData) => {
    setIsActionPending(true);
    let success = false;
    if (formUser) {
      // Edit mode
      success = await editUser(formUser.id, formData);
    } else {
      // Add mode
      success = await addUser(formData);
    }
    setIsActionPending(false);
    if (success) {
      setIsFormOpen(false);
      setFormUser(null);
    }
  };

  // Delete Action Handlers
  const handleDeleteTrigger = (user) => {
    setDeleteTargetUser(user);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async (id) => {
    setIsActionPending(true);
    const success = await deleteUser(id);
    setIsActionPending(false);
    if (success) {
      setIsDeleteOpen(false);
      setDeleteTargetUser(null);
    }
  };

  // Reset granular filters popup parameters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      firstName: '',
      lastName: '',
      email: '',
      department: ''
    });
  };

  return (
    <div className="container">
      {/* Header section */}
      <Header
        totalUsersCount={totalUsersCount}
        rawUsersCount={rawUsersCount}
        onAddUserClick={() => {
          setFormUser(null);
          setIsFormOpen(true);
        }}
      />

      {/* Error alert banner */}
      {error && (
        <div className="error-banner" role="alert">
          <div className="error-banner-content">
            <span className="error-banner-icon">⚠</span>
            <span>{error}</span>
          </div>
          <button 
            className="error-banner-close" 
            onClick={() => setError(null)}
            title="Dismiss error"
            aria-label="Dismiss error banner"
          >
            ×
          </button>
        </div>
      )}

      {/* Toolbar filter area */}
      <div className="toolbar-wrapper">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <FilterPopup
          activeFilters={filters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Loader / Grid View */}
      {loading && users.length === 0 ? (
        <div className="loading-container glass-panel" aria-live="polite" aria-busy="true">
          <div className="spinner"></div>
          <p>Syncing user directories...</p>
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEditClick={(user) => {
              setFormUser(user);
              setIsFormOpen(true);
            }}
            onDeleteClick={handleDeleteTrigger}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            totalItemsCount={totalUsersCount}
            itemsOnPageCount={users.length}
          />
        </>
      )}

      {/* Modal - Add / Edit Form */}
      <UserForm
        isOpen={isFormOpen}
        user={formUser}
        onSave={handleSaveUser}
        onCancel={() => {
          setIsFormOpen(false);
          setFormUser(null);
        }}
        isSaving={isActionPending}
      />

      {/* Modal - Delete confirmation safety popup */}
      <ConfirmDelete
        isOpen={isDeleteOpen}
        user={deleteTargetUser}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeleteTargetUser(null);
        }}
        isDeleting={isActionPending}
      />
    </div>
  );
}
