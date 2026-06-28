import { useState, useEffect, useMemo, useCallback } from 'react';
import * as userService from '../api/userService';
import { mapApiUserToFrontend } from '../utils/helpers';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });
  
  // Sorting States
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Fetch users on mount
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      const mapped = data.map(mapApiUserToFrontend);
      setUsers(mapped);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Add User action
  const addUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // JSONPlaceholder simulated response
      const apiResult = await userService.createUser(userData);
      
      // Since JSONPlaceholder always returns ID 11 for new users,
      // we need to generate a unique local ID if 11 already exists.
      const currentIds = users.map(u => u.id);
      const newId = currentIds.includes(apiResult.id) 
        ? Math.max(...currentIds, 0) + 1 
        : apiResult.id;

      const newUser = {
        id: newId,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim(),
        department: userData.department
      };

      // Add to beginning of list
      setUsers(prev => [newUser, ...prev]);
      // Return to page 1 to see the newly added user
      setCurrentPage(1);
      return true;
    } catch (err) {
      console.error(err);
      setError('Failed to add user. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Edit User action
  const editUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      // JSONPlaceholder will throw 404 for IDs that don't exist on their mock database (ID > 10)
      if (id <= 10) {
        await userService.updateUser(id, userData);
      }
      
      // Update local state
      setUsers(prev => prev.map(user => {
        if (user.id === id) {
          return {
            id,
            firstName: userData.firstName.trim(),
            lastName: userData.lastName.trim(),
            email: userData.email.trim(),
            department: userData.department
          };
        }
        return user;
      }));
      return true;
    } catch (err) {
      console.error(err);
      setError('Failed to update user. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete User action
  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      // JSONPlaceholder will throw 404 for IDs that don't exist on their mock database (ID > 10)
      if (id <= 10) {
        await userService.deleteUser(id);
      }
      
      // Update local state
      setUsers(prev => prev.filter(user => user.id !== id));
      
      // If we delete the last item on a page, return to previous page
      const totalFiltered = filteredAndSortedUsers.length - 1;
      const maxPage = Math.max(1, Math.ceil(totalFiltered / pageSize));
      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }
      return true;
    } catch (err) {
      console.error(err);
      setError('Failed to delete user. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 1. Filter and Search logic
  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(user => {
        // Search Query matches First Name, Last Name, or Email
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q ||
          user.firstName.toLowerCase().includes(q) ||
          user.lastName.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q);

        // Granular filters popup matches
        const matchesFilterFirstName = !filters.firstName ||
          user.firstName.toLowerCase().includes(filters.firstName.toLowerCase().trim());
        const matchesFilterLastName = !filters.lastName ||
          user.lastName.toLowerCase().includes(filters.lastName.toLowerCase().trim());
        const matchesFilterEmail = !filters.email ||
          user.email.toLowerCase().includes(filters.email.toLowerCase().trim());
        const matchesFilterDept = !filters.department ||
          user.department === filters.department;

        return matchesSearch && 
               matchesFilterFirstName && 
               matchesFilterLastName && 
               matchesFilterEmail && 
               matchesFilterDept;
      })
      .sort((a, b) => {
        // Sort logic
        let comparison = 0;
        if (sortField === 'id') {
          comparison = a.id - b.id;
        } else {
          const valA = String(a[sortField] || '').toLowerCase();
          const valB = String(b[sortField] || '').toLowerCase();
          comparison = valA.localeCompare(valB);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [users, searchQuery, filters, sortField, sortOrder]);

  // Reset pagination if filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, pageSize]);

  // 2. Pagination Math
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedUsers, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedUsers.length / pageSize));

  // Toggle sort order or change sort field
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return {
    users: paginatedUsers,
    totalUsersCount: filteredAndSortedUsers.length,
    rawUsersCount: users.length,
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
    deleteUser,
    refetchUsers: fetchUsers
  };
};
