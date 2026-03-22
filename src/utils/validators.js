// Form Validation Utilities

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return {
            isValid: false,
            message: 'Password must be at least 6 characters long'
        };
    }

    // Optional: Add more strict requirements
    // if (!/(?=.*[a-z])/.test(password)) {
    //   return {
    //     isValid: false,
    //     message: 'Password must contain at least one lowercase letter'
    //   };
    // }

    return {
        isValid: true,
        message: 'Password is valid'
    };
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number is valid
 */
export const isValidPhone = (phone) => {
    // Basic validation for 10 digit phone numbers
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

/**
 * Check if field is empty
 * @param {string} value - Value to check
 * @returns {boolean} True if field is empty
 */
export const isEmpty = (value) => {
    return !value || value.trim() === '';
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} Validation result with isValid and message
 */
export const validateRequired = (value, fieldName = 'Field') => {
    if (isEmpty(value)) {
        return {
            isValid: false,
            message: `${fieldName} is required`
        };
    }
    return {
        isValid: true,
        message: ''
    };
};

/**
 * Validate number field
 * @param {string|number} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @returns {object} Validation result with isValid and message
 */
export const validateNumber = (value, fieldName = 'Field', min = null, max = null) => {
    const num = Number(value);

    if (isNaN(num)) {
        return {
            isValid: false,
            message: `${fieldName} must be a valid number`
        };
    }

    if (min !== null && num < min) {
        return {
            isValid: false,
            message: `${fieldName} must be at least ${min}`
        };
    }

    if (max !== null && num > max) {
        return {
            isValid: false,
            message: `${fieldName} must be at most ${max}`
        };
    }

    return {
        isValid: true,
        message: ''
    };
};

/**
 * Validate registration form
 * @param {object} formData - Form data to validate
 * @returns {object} Validation result with isValid and errors object
 */
export const validateRegistrationForm = (formData) => {
    const errors = {};

    // Username validation
    const usernameValidation = validateRequired(formData.username, 'Username');
    if (!usernameValidation.isValid) {
        errors.username = usernameValidation.message;
    }

    // Email validation
    const emailRequired = validateRequired(formData.email, 'Email');
    if (!emailRequired.isValid) {
        errors.email = emailRequired.message;
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
    }

    // Role validation
    const roleValidation = validateRequired(formData.role, 'Role');
    if (!roleValidation.isValid) {
        errors.role = roleValidation.message;
    }

    // Contact number validation
    if (formData.contactno && !isValidPhone(formData.contactno)) {
        errors.contactno = 'Please enter a valid 10-digit phone number';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate login form
 * @param {object} formData - Form data to validate
 * @returns {object} Validation result with isValid and errors object
 */
export const validateLoginForm = (formData) => {
    const errors = {};

    // Email validation
    const emailRequired = validateRequired(formData.email, 'Email');
    if (!emailRequired.isValid) {
        errors.email = emailRequired.message;
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Password validation
    const passwordRequired = validateRequired(formData.password, 'Password');
    if (!passwordRequired.isValid) {
        errors.password = passwordRequired.message;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
