import { Toaster } from 'react-hot-toast'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

// Context
import { AuthProvider } from './context/AuthContext'

// Components
import PageShell from './components/Layout/PageShell'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Appointments from './pages/Appointments'
import Dashboard from './pages/Dashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import MedicalRecords from './pages/MedicalRecords'
import PatientDashboard from './pages/PatientDashboard'
import Patients from './pages/Patients'
import RoleSelect from './pages/RoleSelect'
import Signup from './pages/Signup'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', background: '#060b18' }}>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RoleSelect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Patient Dashboard - Protected */}
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute requiredRole="PATIENT">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />

            {/* Doctor Dashboard - Protected */}
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard & Pages - Protected */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={<Navigate to="/admin-dashboard" replace />}
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <PageShell><Appointments /></PageShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PageShell><Patients /></PageShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <PageShell><Doctors /></PageShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-records"
              element={
                <ProtectedRoute>
                  <PageShell><MedicalRecords /></PageShell>
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App