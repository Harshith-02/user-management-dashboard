import { describe, it, expect } from 'vitest';
import { splitFullName, getAssignedDepartment, mapApiUserToFrontend } from '../utils/helpers';
import { DEPARTMENTS } from '../utils/constants';

describe('splitFullName helper', () => {
  it('should split simple first and last names', () => {
    const { firstName, lastName } = splitFullName('Leanne Graham');
    expect(firstName).toBe('Leanne');
    expect(lastName).toBe('Graham');
  });

  it('should split multi-word last names on the first space', () => {
    const { firstName, lastName } = splitFullName('Mrs. Dennis Schulist');
    expect(firstName).toBe('Mrs.');
    expect(lastName).toBe('Dennis Schulist');
  });

  it('should handle single name string gracefully', () => {
    const { firstName, lastName } = splitFullName('Cher');
    expect(firstName).toBe('Cher');
    expect(lastName).toBe('');
  });

  it('should return empty strings for empty input', () => {
    const { firstName, lastName } = splitFullName('');
    expect(firstName).toBe('');
    expect(lastName).toBe('');
  });
});

describe('getAssignedDepartment helper', () => {
  it('should assign a department consistently based on numeric ID', () => {
    const dept1 = getAssignedDepartment(1);
    const dept2 = getAssignedDepartment(1);
    const dept3 = getAssignedDepartment(2);

    expect(dept1).toBe(DEPARTMENTS[1 % DEPARTMENTS.length]);
    expect(dept2).toBe(dept1);
    expect(dept3).toBe(DEPARTMENTS[2 % DEPARTMENTS.length]);
  });

  it('should handle non-numeric IDs gracefully', () => {
    const dept = getAssignedDepartment('uuid-random-key');
    expect(DEPARTMENTS).toContain(dept);
  });
});

describe('mapApiUserToFrontend helper', () => {
  it('should transform a raw API user into our target schema', () => {
    const rawApiUser = {
      id: 5,
      name: 'Chelsey Dietrich',
      email: 'Lucio_Hettinger@annie.ca',
      address: { city: 'Roscoeview' }
    };

    const mapped = mapApiUserToFrontend(rawApiUser);
    expect(mapped.id).toBe(5);
    expect(mapped.firstName).toBe('Chelsey');
    expect(mapped.lastName).toBe('Dietrich');
    expect(mapped.email).toBe('Lucio_Hettinger@annie.ca');
    expect(mapped.department).toBe(DEPARTMENTS[5 % DEPARTMENTS.length]);
  });
});
