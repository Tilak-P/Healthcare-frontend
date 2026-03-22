import { useEffect, useState } from 'react'
import { FaCalendarAlt, FaTimes, FaUserMd } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { getAllDoctors, getAllPatients, getPatientByUserId } from '../../services/api'

const AppointmentForm = ({ onClose, onSubmit, appointment = null }) => {
    const { user } = useAuth()

    const [dateVal, setDateVal] = useState('')
    const [timeVal, setTimeVal] = useState('')
    const [formData, setFormData] = useState({ description: '', doctorId: '', patientId: '' })
    const [doctors, setDoctors] = useState([])
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (appointment) {
            const raw = appointment.appointmentDate ? appointment.appointmentDate.slice(0, 16) : ''
            if (raw) { setDateVal(raw.slice(0, 10)); setTimeVal(raw.slice(11, 16)) }
            setFormData({
                description: appointment.description || '',
                doctorId: appointment.doctor?.id || '',
                patientId: appointment.patient?.id || '',
            })
        }
    }, [appointment])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isPatient = user?.role === 'PATIENT'
                const requests = [getAllDoctors().catch(() => [])]
                if (isPatient && user?.id) requests.push(getPatientByUserId(user.id).catch(() => null))
                else requests.push(getAllPatients().catch(() => []))

                const [doctorsData, patientResult] = await Promise.all(requests)
                setDoctors(Array.isArray(doctorsData) ? doctorsData : [])
                if (isPatient) {
                    if (patientResult) { setPatients([patientResult]); setFormData(prev => ({ ...prev, patientId: patientResult.id })) }
                } else {
                    setPatients(Array.isArray(patientResult) ? patientResult : [])
                }
            } catch (err) {
                console.error('Failed to load form data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!formData.description.trim()) { setError('Please describe the reason for the appointment.'); return }
        if (!dateVal) { setError('Please select a date.'); return }
        if (!timeVal) { setError('Please select a time.'); return }

        const payload = {
            appointmentDate: `${dateVal}T${timeVal}:00`,
            description: formData.description,
        }
        if (formData.doctorId) payload.doctor = { id: parseInt(formData.doctorId) }
        if (formData.patientId) payload.patient = { id: parseInt(formData.patientId) }
        if (appointment) payload.id = appointment.id

        try {
            setSubmitting(true)
            await onSubmit(payload)
        } catch (err) {
            setError(err.message || 'Failed to save appointment.')
        } finally {
            setSubmitting(false)
        }
    }

    const today = new Date().toISOString().slice(0, 10)
    const fieldCls = "w-full px-3 py-3 text-sm outline-none rounded-xl transition-all"
    const fieldStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9' }
    const onFocusIn = e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'rgba(255,255,255,0.1)' }
    const onFocusOut = e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.06)' }
    const labelStyle = { color: 'rgba(255,255,255,0.4)' }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(14px)' }}>
            <div className="w-full max-w-md animate-scale-in rounded-3xl overflow-hidden"
                style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)' }}>

                {/* Gradient header */}
                <div className="p-5 flex items-center justify-between"
                    style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2,#6366f1)' }}>
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                            <FaCalendarAlt />
                        </div>
                        <div>
                            <h2 className="text-lg font-black">{appointment ? 'Edit Appointment' : 'New Appointment'}</h2>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Fill in the details below</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors border"
                        style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                        <FaTimes className="text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {error && (
                        <div className="px-4 py-3 rounded-2xl text-sm font-semibold"
                            style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#fda4af' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={labelStyle}>📅 Date *</label>
                        <input type="date" value={dateVal} min={today} onChange={e => setDateVal(e.target.value)} required
                            className={fieldCls} style={fieldStyle} onFocus={onFocusIn} onBlur={onFocusOut} />
                    </div>

                    {/* Time */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={labelStyle}>🕐 Time *</label>
                        <input type="time" value={timeVal} onChange={e => setTimeVal(e.target.value)} required
                            className={fieldCls} style={fieldStyle} onFocus={onFocusIn} onBlur={onFocusOut} />
                    </div>

                    {/* Doctor */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={labelStyle}>
                            <FaUserMd className="inline mr-1 text-indigo-400" /> Doctor
                        </label>
                        {!loading && doctors.length === 0 ? (
                            <div className="px-3 py-2 rounded-xl text-sm"
                                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fde68a' }}>
                                ⚠️ No doctors registered. Contact admin.
                            </div>
                        ) : (
                            <select name="doctorId" value={formData.doctorId} onChange={handleChange} disabled={loading}
                                className={fieldCls} style={fieldStyle}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}>
                                <option value="" style={{ background: '#1e293b' }}>{loading ? 'Loading...' : '— Select Doctor —'}</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id} style={{ background: '#1e293b' }}>
                                        {doc.name || `Doctor #${doc.id}`}{doc.specialization ? ` · ${doc.specialization}` : ''}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Patient (Admin/Doctor only) */}
                    {user?.role !== 'PATIENT' && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={labelStyle}>👤 Patient</label>
                            <select name="patientId" value={formData.patientId} onChange={handleChange} disabled={loading}
                                className={fieldCls} style={fieldStyle}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}>
                                <option value="" style={{ background: '#1e293b' }}>{loading ? 'Loading...' : '— Select Patient —'}</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id} style={{ background: '#1e293b' }}>{p.name || `Patient #${p.id}`}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={labelStyle}>📋 Reason / Notes *</label>
                        <textarea name="description" value={formData.description} onChange={handleChange}
                            rows={3} required placeholder="e.g. Routine checkup, chest pain follow-up…"
                            className={`${fieldCls} resize-none`} style={fieldStyle}
                            onFocus={onFocusIn} onBlur={onFocusOut} />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 text-sm font-bold rounded-2xl transition-all"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting || loading}
                            className="flex-1 py-3 text-sm font-black rounded-2xl text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
                            {submitting
                                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                                : appointment ? '✓ Update' : '+ Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AppointmentForm
