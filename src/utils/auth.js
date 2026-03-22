// Authentication Utility Functions

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
    return localStorage.getItem('authToken');
};

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token to store
 */
export const setToken = (token) => {
    localStorage.setItem('authToken', token);
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
    localStorage.removeItem('authToken');
};

/**
 * Get user data from localStorage
 * @returns {object|null} User data or null if not found
 */
export const getUser = () => {
    const userStr = localStorage.getItem('userData');
    return userStr ? JSON.parse(userStr) : null;
};

/**
 * Store user data in localStorage
 * @param {object} user - User data to store
 */
export const setUser = (user) => {
    localStorage.setItem('userData', JSON.stringify(user));
};

/**
 * Remove user data from localStorage
 */
export const removeUser = () => {
    localStorage.removeItem('userData');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

/**
 * Get current user's role
 * @returns {string|null} User role or null if not authenticated
 */
export const getUserRole = () => {
    const user = getUser();
    return user ? user.role : null;
};

/**
 * Decode JWT token (basic decoding, not validation)
 * @param {string} token - JWT token to decode
 * @returns {object|null} Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

/**
 * Clear all authentication data
 */
export const logout = () => {
    removeToken();
    removeUser();
};

/**
 * Check if user has required role
 * @param {string} requiredRole - Required role to check
 * @returns {boolean} True if user has the required role
 */
export const hasRole = (requiredRole) => {
    const userRole = getUserRole();
    return userRole === requiredRole;
};

/**
 * Check if user has any of the required roles
 * @param {string[]} requiredRoles - Array of required roles
 * @returns {boolean} True if user has any of the required roles
 */
export const hasAnyRole = (requiredRoles) => {
    const userRole = getUserRole();
    return requiredRoles.includes(userRole);
};
