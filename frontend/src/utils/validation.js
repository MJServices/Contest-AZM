// Comprehensive validation utility for form inputs

export const validators = {
  // Email validation
  email: {
    required: (value) => {
      if (!value || !value.trim()) {
        return 'Please enter your email address';
      }
      return null;
    },
    format: (value) => {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address (e.g., user@example.com)';
      }
      return null;
    }
  },

  // Password validation
  password: {
    required: (value) => {
      if (!value) {
        return 'Please enter your password';
      }
      return null;
    },
    minLength: (value, minLength = 8) => {
      if (value.length < minLength) {
        return `Password must be at least ${minLength} characters long`;
      }
      return null;
    },
    strength: (value) => {
      const hasLowercase = /[a-z]/.test(value);
      const hasUppercase = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      if (!hasLowercase) {
        return 'Password must contain at least one lowercase letter';
      }
      if (!hasUppercase) {
        return 'Password must contain at least one uppercase letter';
      }
      if (!hasNumber) {
        return 'Password must contain at least one number';
      }
      return null;
    },
    match: (password, confirmPassword) => {
      if (password !== confirmPassword) {
        return 'Passwords do not match. Please make sure both passwords are identical';
      }
      return null;
    }
  },

  // Name validation
  name: {
    required: (value, fieldName = 'Name') => {
      if (!value || !value.trim()) {
        return `Please enter your ${fieldName.toLowerCase()}`;
      }
      return null;
    },
    minLength: (value, minLength = 2, fieldName = 'Name') => {
      if (value.trim().length < minLength) {
        return `${fieldName} must be at least ${minLength} characters long`;
      }
      return null;
    },
    format: (value, fieldName = 'Name') => {
      const nameRegex = /^[a-zA-Z\s'-]+$/;
      if (!nameRegex.test(value.trim())) {
        return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
      }
      return null;
    }
  },

  // Username validation
  username: {
    required: (value) => {
      if (!value || !value.trim()) {
        return 'Please enter a username';
      }
      return null;
    },
    length: (value, minLength = 3, maxLength = 30) => {
      if (value.length < minLength || value.length > maxLength) {
        return `Username must be between ${minLength} and ${maxLength} characters long`;
      }
      return null;
    },
    format: (value) => {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(value)) {
        return 'Username can only contain letters, numbers, and underscores';
      }
      return null;
    },
    startsWith: (value) => {
      if (!/^[a-zA-Z]/.test(value)) {
        return 'Username must start with a letter';
      }
      return null;
    }
  },

  // Phone validation
  phone: {
    format: (value) => {
      if (!value) return null; // Optional field
      
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanValue = value.replace(/\s/g, '');
      
      if (!phoneRegex.test(cleanValue)) {
        return 'Please enter a valid phone number';
      }
      return null;
    },
    length: (value) => {
      if (!value) return null; // Optional field
      
      const cleanValue = value.replace(/[\s\-\(\)\+]/g, '');
      if (cleanValue.length < 10 || cleanValue.length > 15) {
        return 'Phone number must be between 10 and 15 digits';
      }
      return null;
    }
  }
};

// Validation runner function
export const validateField = (value, validationRules) => {
  for (const rule of validationRules) {
    const error = rule(value);
    if (error) {
      return error;
    }
  }
  return null;
};

// Comprehensive form validation
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  let isValid = true;

  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    const fieldValue = formData[fieldName];
    const error = validateField(fieldValue, rules);
    
    if (error) {
      errors[fieldName] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Pre-defined validation schemas
export const validationSchemas = {
  registration: {
    firstName: [
      validators.name.required,
      (value) => validators.name.minLength(value, 2, 'First name'),
      (value) => validators.name.format(value, 'First name')
    ],
    lastName: [
      validators.name.required,
      (value) => validators.name.minLength(value, 2, 'Last name'),
      (value) => validators.name.format(value, 'Last name')
    ],
    username: [
      validators.username.required,
      validators.username.length,
      validators.username.format,
      validators.username.startsWith
    ],
    email: [
      validators.email.required,
      validators.email.format
    ],
    contactNumber: [
      validators.phone.format,
      validators.phone.length
    ],
    password: [
      validators.password.required,
      validators.password.minLength,
      validators.password.strength
    ]
  },

  login: {
    email: [
      validators.email.required,
      validators.email.format
    ],
    password: [
      validators.password.required,
      (value) => validators.password.minLength(value, 8)
    ]
  }
};

// Password strength checker
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'No password', color: '#e5e7eb' };

  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  // Calculate score
  Object.values(checks).forEach(check => {
    if (check) score++;
  });

  // Bonus for length
  if (password.length >= 12) score += 0.5;
  if (password.length >= 16) score += 0.5;

  // Determine strength level
  if (score < 2) {
    return { score, label: 'Very Weak', color: '#ef4444' };
  } else if (score < 3) {
    return { score, label: 'Weak', color: '#f59e0b' };
  } else if (score < 4) {
    return { score, label: 'Fair', color: '#eab308' };
  } else if (score < 5) {
    return { score, label: 'Good', color: '#22c55e' };
  } else {
    return { score, label: 'Strong', color: '#16a34a' };
  }
};

// Real-time validation debouncer
export const createDebouncedValidator = (validator, delay = 300) => {
  let timeoutId;
  
  return (value, callback) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const error = validator(value);
      callback(error);
    }, delay);
  };
};

export default {
  validators,
  validateField,
  validateForm,
  validationSchemas,
  getPasswordStrength,
  createDebouncedValidator
};