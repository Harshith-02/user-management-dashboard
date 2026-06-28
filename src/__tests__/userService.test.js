import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as userService from '../api/userService';
import { API_BASE_URL } from '../utils/constants';

// Mock axios module
vi.mock('axios');

describe('userService API requests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getUsers should call axios.get and return data', async () => {
    const mockUsers = [{ id: 1, name: 'Leanne Graham' }];
    axios.get.mockResolvedValueOnce({ data: mockUsers });

    const result = await userService.getUsers();
    
    expect(axios.get).toHaveBeenCalledWith(API_BASE_URL);
    expect(result).toEqual(mockUsers);
  });

  it('createUser should call axios.post with name combination and return data', async () => {
    const newUser = { firstName: 'John', lastName: 'Doe', email: 'john@example.com', department: 'Sales' };
    const mockResponse = { id: 11, name: 'John Doe', email: 'john@example.com', department: 'Sales' };
    
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await userService.createUser(newUser);

    expect(axios.post).toHaveBeenCalledWith(API_BASE_URL, {
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Sales'
    });
    expect(result).toEqual(mockResponse);
  });

  it('updateUser should call axios.put with specific user ID and return data', async () => {
    const updatedUser = { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', department: 'Marketing' };
    const mockResponse = { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' };
    
    axios.put.mockResolvedValueOnce({ data: mockResponse });

    const result = await userService.updateUser(2, updatedUser);

    expect(axios.put).toHaveBeenCalledWith(`${API_BASE_URL}/2`, {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      department: 'Marketing'
    });
    expect(result).toEqual(mockResponse);
  });

  it('deleteUser should call axios.delete and complete successfully', async () => {
    axios.delete.mockResolvedValueOnce({ status: 200 });

    await userService.deleteUser(3);

    expect(axios.delete).toHaveBeenCalledWith(`${API_BASE_URL}/3`);
  });
});
