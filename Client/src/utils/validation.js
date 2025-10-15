// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 6;
};

export const validateName = (name) => {
  // At least 2 characters, only letters and spaces
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name);
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    // Required validation
    if (fieldRules.required && (!value || value.trim() === '')) {
      errors[field] = `${fieldRules.label || field} is required`;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') return;
    
    // Email validation
    if (fieldRules.email && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (fieldRules.phone && !validatePhone(value)) {
      errors[field] = 'Please enter a valid phone number';
    }
    
    // Password validation
    if (fieldRules.password && !validatePassword(value)) {
      errors[field] = 'Password must be at least 6 characters long';
    }
    
    // Name validation
    if (fieldRules.name && !validateName(value)) {
      errors[field] = 'Name must contain only letters and be at least 2 characters';
    }
    
    // Min length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`;
    }
    
    // Max length validation
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `${fieldRules.label || field} must not exceed ${fieldRules.maxLength} characters`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const validationRules = {
  login: {
    phone: { required: true, phone: true, label: 'Phone number' },
    password: { required: true, label: 'Password' }
  },
  signup: {
    name: { required: true, name: true, label: 'Full name' },
    email: { required: true, email: true, label: 'Email' },
    phone: { required: true, phone: true, label: 'Phone number' },
    password: { required: true, password: true, label: 'Password' }
  },
  complaint: {
    title: { required: true, minLength: 5, maxLength: 100, label: 'Title' },
    description: { required: true, minLength: 10, maxLength: 500, label: 'Description' }
  }
};
