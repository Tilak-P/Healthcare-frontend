import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getToken, getUser } from '../utils/auth';

/**
 * ProtectedRoute component to guard routes that require authentication
 * @param {object} props - Component props
 * @param {React.Component} props.children - Child components to render if authenticated
 * @param {string} props.requiredRole - Required user role to access the route
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: '/login')
 * @returns {React.Component} Protected route component
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo = '/' }) => {
    const { isAuthenticated, user, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Check both context state AND localStorage to avoid race conditions
    const storedToken = getToken();
    const storedUser = getUser();
    const effectivelyAuthenticated = isAuthenticated || (storedToken && storedUser);
    const effectiveUser = user || storedUser;

    // Redirect to login if not authenticated
    if (!effectivelyAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // Check if user has required role
    if (requiredRole && effectiveUser?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const dashboardMap = {
            'ADMIN': '/admin-dashboard',
            'DOCTOR': '/doctor-dashboard',
            'PATIENT': '/patient-dashboard',
        };

        const userDashboard = dashboardMap[effectiveUser?.role] || '/';
        return <Navigate to={userDashboard} replace />;
    }

    // Render children if authenticated and has required role
    return children;
};

export default ProtectedRoute;

