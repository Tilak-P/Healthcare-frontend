import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { getAllDoctors, getAllPatients, getDoctorByUserId, getPatientByUserId } from '../../services/api'

const MedicalRecordForm = ({ onClose, onSubmit, record = null, prefilledPatientId = null }) => {
    const { user } = useAuth()
    const isPatient = user?.role === 'PATIENT'
    const isDoctor = user?.role === 'DOCTOR'

    const [formData, setFormData] = useState({
        diagnosis: '',
        prescription: '',
        reportLink: '',
        date: '',
        doctorId: '',
        patientId: '',
    })
    const [doctors, setDoctors] = useState([])
    const [patients, setPatients] = useState([])
    const [doctorName, setDoctorName] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isPatient && user?.id) {
                    // Patient: get own profile + all doctors to pick from
                    const [doctorsData, patientData] = await Promise.all([
                        getAllDoctors().catch(() => []),
                        getPatientByUserId(user.id).catch(() => null),
                    ])
                    setDoctors(Array.isArray(doctorsData) ? doctorsData : [])
                    if (patientData) {
                        setFormData(prev => ({ ...prev, patientId: patientData.id }))
                    }
                } else if (isDoctor && user?.id) {
                    // Doctor: auto-fill their own profile + load all patients to select
                    const [doctorData, patientsData] = await Promise.all([
                        getDoctorByUserId(user.id).catch(() => null),
                        getAllPatients().catch(() => []),
                    ])
                    if (doctorData) {
                        setDoctorName(doctorData.name || user.username)
                        setFormData(prev => ({ ...prev, doctorId: doctorData.id }))
                    }
                    setPatients(Array.isArray(patientsData) ? patientsData : [])
                    // Pre-select patient from appointment if provided
                    if (prefilledPatientId) {
                        setFormData(prev => ({ ...prev, patientId: prefilledPatientId }))
                    }
                } else {
                    // Admin: full control — all doctors and all patients
                    const [doctorsData, patientsData] = await Promise.all([
                        getAllDoctors().catch(() => []),
                        getAllPatients().catch(() => []),
                    ])
                    setDoctors(Array.isArray(doctorsData) ? doctorsData : [])
                    setPatients(Array.isArray(patientsData) ? patientsData : [])
                }
            } catch (err) {
                console.error('Failed to load form data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    // Pre-fill when editing
    useEffect(() => {
        if (record) {
            setFormData({
                diagnosis: record.diagnosis || '',
                prescription: record.prescription || '',
                reportLink: record.reportLink || '',
                date: record.date || '',
                doctorId: record.doctor?.id || '',
                patientId: record.patient?.id || '',
            })
        }
    }, [record])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!formData.diagnosis || !formData.date) {
            setError('Please fill in diagnosis and date.')
            return
        }
        if (!isPatient && !formData.patientId) {
            setError('Please select a patient.')
            return
        }

        const payload = {
            diagnosis: formData.diagnosis,
            prescription: formData.prescription,
            reportLink: formData.reportLink,
            date: formData.date,
        }

        if (formData.doctorId) payload.doctor = { id: parseInt(formData.doctorId) }
        if (formData.patientId) payload.patient = { id: parseInt(formData.patientId) }
        if (record) payload.id = record.id

        onSubmit(payload)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg">📋</div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight">
                                {record ? 'Edit Medical Record' : 'Add Medical Record'}
                            </h2>
                            <p className="text-emerald-100 text-xs">Fill in the details below</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors">
                        <FaTimes className="text-white text-sm" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">{error}</div>
                    )}

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">📅 Date *</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all"
                            required
                        />
                    </div>

                    {/* Diagnosis */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">🩺 Diagnosis *</label>
                        <textarea
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            rows={2}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all resize-none"
                            placeholder="Enter diagnosis..."
                            required
                        />
                    </div>

                    {/* Prescription */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">💊 Prescription</label>
                        <textarea
                            name="prescription"
                            value={formData.prescription}
                            onChange={handleChange}
                            rows={2}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all resize-none"
                            placeholder="Enter prescription details..."
                        />
                    </div>

                    {/* Report Link */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">🔗 Report Link</label>
                        <input
                            type="text"
                            name="reportLink"
                            value={formData.reportLink}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all"
                            placeholder="URL to report file..."
                        />
                    </div>

                    {/* Doctor — auto-filled for DOCTOR role, dropdown for ADMIN */}
                    {isDoctor ? (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">👨‍⚕️ Doctor</label>
                            <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 rounded-xl px-3 py-2 text-sm text-emerald-800 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                {doctorName || user?.username || 'You'}
                            </div>
                        </div>
                    ) : !isPatient && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">👨‍⚕️ Doctor</label>
                            <select
                                name="doctorId"
                                value={formData.doctorId}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all disabled:opacity-50"
                            >
                                <option value="">{loading ? 'Loading...' : '— Select Doctor —'}</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.name || `Doctor #${doc.id}`}
                                        {doc.specialization ? ` · ${doc.specialization}` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Patient — hidden for PATIENT role, required dropdown for DOCTOR/ADMIN */}
                    {!isPatient && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">👤 Patient *</label>
                            <select
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all disabled:opacity-50"
                            >
                                <option value="">{loading ? 'Loading...' : '— Select Patient —'}</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name || `Patient #${p.id}`}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 py-2.5 text-sm bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:opacity-90 transition-opacity font-semibold">
                            {record ? '✓ Update' : '+ Add'} Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MedicalRecordForm
