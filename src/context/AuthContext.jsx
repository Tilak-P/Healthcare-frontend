import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { logout as clearAuth, getToken, getUser, isTokenExpired, setToken as saveToken, setUser as saveUser } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initAuth = () => {
            const storedToken = getToken();
            const storedUser = getUser();

            if (storedToken && storedUser) {
                // Check if token is expired
                if (!isTokenExpired(storedToken)) {
                    setToken(storedToken);
                    setUser(storedUser);
                    setIsAuthenticated(true);
                } else {
                    // Token expired, clear auth
                    clearAuth();
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await apiLogin(credentials);

            if (response.success || response.token) {
                const authToken = response.token;
                const userData = response.user;

                // Save to state
                setToken(authToken);
                setUser(userData);
                setIsAuthenticated(true);

                // Save to localStorage
                saveToken(authToken);
                saveUser(userData);

                return { success: true, user: userData };
            }

            return { success: false, message: 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Login failed. Please try again.'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await apiRegister(userData);

            // Backend returns plain text strings like "User registered successfully"
            // or "Email already registered!" — check for success/failure keywords
            const responseStr = typeof response === 'string' ? response : (response?.message || '');
            const isSuccess = responseStr.toLowerCase().includes('successfully') ||
                responseStr.toLowerCase().includes('success');

            return {
                success: isSuccess,
                message: responseStr || (isSuccess ? 'Registration successful' : 'Registration failed')
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        clearAuth();
    };

    const updateUserData = (updatedUser) => {
        setUser(updatedUser);
        saveUser(updatedUser);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUserData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export default AuthContext;
