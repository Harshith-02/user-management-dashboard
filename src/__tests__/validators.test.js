import { describe, it, expect } from 'vitest';
import { validateUserForm } from '../utils/validators';

describe('validateUserForm', () => {
  it('should return errors for empty fields', () => {
    const emptyForm = {
      firstName: '',
      lastName: '',
      email: '',
      department: ''
    };
    const errors = validateUserForm(emptyForm);
    expect(errors.firstName).toBe('First Name is required.');
    expect(errors.lastName).toBe('Last Name is required.');
    expect(errors.email).toBe('Email address is required.');
    expect(errors.department).toBe('Department selection is required.');
  });

  it('should validate invalid name strings', () => {
    const invalidForm = {
      firstName: 'John123',
      lastName: 'Doe$',
      email: 'john.doe@example.com',
      department: 'Engineering'
    };
    const errors = validateUserForm(invalidForm);
    expect(errors.firstName).toBe('First Name should only contain letters, spaces, hyphens, or apostrophes.');
    expect(errors.lastName).toBe('Last Name should only contain letters, spaces, hyphens, or apostrophes.');
    expect(errors.email).toBeUndefined();
    expect(errors.department).toBeUndefined();
  });

  it('should validate email format properly', () => {
    const badEmailForm = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doeexample.com',
      department: 'Engineering'
    };
    const errors1 = validateUserForm(badEmailForm);
    expect(errors1.email).toBe('Please enter a valid email address.');

    const badEmailForm2 = {
      ...badEmailForm,
      email: 'john.doe@example'
    };
    const errors2 = validateUserForm(badEmailForm2);
    // Depending on strictness, john.doe@example.com is standard.
    // Our regex checks: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ which fails john.doe@example (no dot)
    expect(errors2.email).toBe('Please enter a valid email address.');
  });

  it('should return no errors for a valid form', () => {
    const validForm = {
      firstName: 'Leanne-Marie',
      lastName: "O'Connor",
      email: 'leanne.oconnor@example.com',
      department: 'Engineering'
    };
    const errors = validateUserForm(validForm);
    expect(Object.keys(errors).length).toBe(0);
  });
});
