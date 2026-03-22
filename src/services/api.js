// API Service for Spring Boot Backend Integration
import { getToken, setToken, setUser } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Create request headers with authentication
 * @returns {object} Headers object
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response
 * @param {Response} response - Fetch response object
 * @returns {Promise} Parsed response data
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');

  // Check if response is JSON
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Throw a descriptive error; let the calling component / ProtectedRoute handle auth failures
    const error = (data && data.message) || data || response.statusText;
    const err = new Error(typeof error === 'string' ? error : 'Request failed');
    err.status = response.status;
    throw err;
  }

  return data;
};

/**
 * Make API request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: getHeaders(),
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// ==================== Authentication API ====================

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise} Registration response
 */
export const register = async (userData) => {
  return apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Login user
 * @param {object} credentials - User credentials (email, password)
 * @returns {Promise} Login response with token and user data
 */
export const login = async (credentials) => {
  const response = await apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (response && response.token) {
    setToken(response.token);
    setUser({
      id: response.id,
      email: response.email,
      username: response.username,
      role: response.role,
    });

    return {
      success: true,
      token: response.token,
      user: {
        id: response.id,
        email: response.email,
        username: response.username,
        role: response.role,
      },
      message: 'Login successful'
    };
  }

  return { success: false, message: 'Login failed' };
};

// ==================== Users API ====================

/**
 * Get all users
 * @returns {Promise} Array of users
 */
export const getAllUsers = async () => {
  return apiRequest('/users');
};

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise} User data
 */
export const getUserById = async (id) => {
  return apiRequest(`/users/${id}`);
};

/**
 * Update user
 * @param {number} id - User ID
 * @param {object} userData - Updated user data
 * @returns {Promise} Update response
 */
export const updateUser = async (id, userData) => {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

/**
 * Delete user
 * @param {number} id - User ID
 * @returns {Promise} Delete response
 */
export const deleteUser = async (id) => {
  return apiRequest(`/users/${id}`, {
    method: 'DELETE',
  });
};

// ==================== Doctors API ====================

/**
 * Get all doctors
 * @returns {Promise} Array of doctors
 */
export const getAllDoctors = async () => {
  return apiRequest('/doctors');
};

/**
 * Get doctor by ID
 * @param {number} id - Doctor ID
 * @returns {Promise} Doctor data
 */
export const getDoctorById = async (id) => {
  return apiRequest(`/doctors/${id}`);
};

/**
 * Create new doctor
 * @param {object} doctorData - Doctor data
 * @returns {Promise} Created doctor
 */
export const createDoctor = async (doctorData) => {
  return apiRequest('/doctors', {
    method: 'POST',
    body: JSON.stringify(doctorData),
  });
};

/**
 * Update doctor
 * @param {number} id - Doctor ID
 * @param {object} doctorData - Updated doctor data
 * @returns {Promise} Update response
 */
export const updateDoctor = async (id, doctorData) => {
  return apiRequest(`/doctors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(doctorData),
  });
};

/**
 * Delete doctor
 * @param {number} id - Doctor ID
 * @returns {Promise} Delete response
 */
export const deleteDoctor = async (id) => {
  return apiRequest(`/doctors/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Get doctor by user ID
 * @param {number} userId - User ID
 * @returns {Promise} Doctor data
 */
export const getDoctorByUserId = async (userId) => {
  return apiRequest(`/doctors/user/${userId}`);
};

/**
 * Get a doctor's availability schedule (availableDays + availableTimeSlots)
 * @param {number} id - Doctor ID
 * @returns {Promise} Availability data
 */
export const getDoctorAvailability = async (id) => {
  return apiRequest(`/doctors/${id}/availability`);
};

/**
 * Update a doctor's availability schedule
 * @param {number} id - Doctor ID
 * @param {{ availableDays: string[], availableTimeSlots: string[] }} data
 * @returns {Promise} Update response
 */
export const updateDoctorAvailability = async (id, data) => {
  return apiRequest(`/doctors/${id}/availability`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// ==================== Patients API ====================

/**
 * Get all patients
 * @returns {Promise} Array of patients
 */
export const getAllPatients = async () => {
  return apiRequest('/patients');
};

/**
 * Get patient by ID
 * @param {number} id - Patient ID
 * @returns {Promise} Patient data
 */
export const getPatientById = async (id) => {
  return apiRequest(`/patients/${id}`);
};

/**
 * Get patient by user ID
 * @param {number} userId - User ID
 * @returns {Promise} Patient data
 */
export const getPatientByUserId = async (userId) => {
  return apiRequest(`/patients/user/${userId}`);
};

/**
 * Create new patient
 * @param {object} patientData - Patient data
 * @returns {Promise} Created patient
 */
export const createPatient = async (patientData) => {
  return apiRequest('/patients', {
    method: 'POST',
    body: JSON.stringify(patientData),
  });
};

/**
 * Update patient
 * @param {number} id - Patient ID
 * @param {object} patientData - Updated patient data
 * @returns {Promise} Update response
 */
export const updatePatient = async (id, patientData) => {
  return apiRequest(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patientData),
  });
};

/**
 * Delete patient
 * @param {number} id - Patient ID
 * @returns {Promise} Delete response
 */
export const deletePatient = async (id) => {
  return apiRequest(`/patients/${id}`, {
    method: 'DELETE',
  });
};

// ==================== Appointments API ====================

/**
 * Get all appointments
 * @returns {Promise} Array of appointments
 */
export const getAllAppointments = async () => {
  return apiRequest('/appointments');
};

/**
 * Get appointment by ID
 * @param {number} id - Appointment ID
 * @returns {Promise} Appointment data
 */
export const getAppointmentById = async (id) => {
  return apiRequest(`/appointments/${id}`);
};

/**
 * Create new appointment
 * @param {object} appointmentData - Appointment data
 * @returns {Promise} Created appointment
 */
export const createAppointment = async (appointmentData) => {
  return apiRequest('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
};

/**
 * Update appointment
 * @param {number} id - Appointment ID
 * @param {object} appointmentData - Updated appointment data
 * @returns {Promise} Updated appointment
 */
export const updateAppointment = async (id, appointmentData) => {
  return apiRequest(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(appointmentData),
  });
};

/**
 * Delete appointment
 * @param {number} id - Appointment ID
 * @returns {Promise} Delete response
 */
export const deleteAppointment = async (id) => {
  return apiRequest(`/appointments/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Update appointment status (CONFIRMED | CANCELLED)
 * @param {number} id - Appointment ID
 * @param {string} status - New status string
 */
export const updateAppointmentStatus = async (id, status) => {
  return apiRequest(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

/**
 * Get appointments by patient ID
 * @param {number} patientId - Patient ID
 * @returns {Promise} Array of appointments
 */
export const getAppointmentsByPatientId = async (patientId) => {
  return apiRequest(`/appointments/patient/${patientId}`);
};

/**
 * Get appointments by doctor ID
 * @param {number} doctorId - Doctor ID
 * @returns {Promise} Array of appointments
 */
export const getAppointmentsByDoctorId = async (doctorId) => {
  return apiRequest(`/appointments/doctor/${doctorId}`);
};

// ==================== Medical Records API ====================

/**
 * Get all medical records
 * @returns {Promise} Array of medical records
 */
export const getAllMedicalRecords = async () => {
  return apiRequest('/records');
};

/**
 * Get medical records for a specific patient
 * @param {number} patientId - Patient ID
 * @returns {Promise} List of medical records
 */
export const getMedicalRecordsByPatientId = async (patientId) => {
  return apiRequest(`/records/patient/${patientId}`);
};

/**
 * Get medical record by ID
 * @param {number} id - Record ID
 * @returns {Promise} Medical record data
 */
export const getMedicalRecordById = async (id) => {
  return apiRequest(`/records/${id}`);
};

/**
 * Create new medical record
 * @param {object} recordData - Medical record data
 * @returns {Promise} Created medical record
 */
export const createMedicalRecord = async (recordData) => {
  return apiRequest('/records', {
    method: 'POST',
    body: JSON.stringify(recordData),
  });
};

/**
 * Update medical record
 * @param {number} id - Record ID
 * @param {object} recordData - Updated medical record data
 * @returns {Promise} Updated medical record
 */
export const updateMedicalRecord = async (id, recordData) => {
  return apiRequest(`/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recordData),
  });
};

/**
 * Delete medical record
 * @param {number} id - Record ID
 * @returns {Promise} Delete response
 */
export const deleteMedicalRecord = async (id) => {
  return apiRequest(`/records/${id}`, {
    method: 'DELETE',
  });
};

// Export all API functions
export const api = {
  // Auth
  register,
  login,

  // Users
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,

  // Doctors
  getAllDoctors,
  getDoctorById,
  getDoctorByUserId,
  getDoctorAvailability,
  updateDoctorAvailability,
  createDoctor,
  updateDoctor,
  deleteDoctor,

  // Patients
  getAllPatients,
  getPatientById,
  getPatientByUserId,
  createPatient,
  updatePatient,
  deletePatient,

  // Appointments
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
  createAppointment,
  updateAppointment,
  deleteAppointment,

  // Medical Records
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
};

export default api;