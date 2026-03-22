import { useEffect, useState } from 'react'
import { FaClock, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'

const SPECIALIZATIONS = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
    'Dermatology', 'Gynecology', 'Ophthalmology', 'ENT',
    'Psychiatry', 'General Medicine', 'Surgery', 'Radiology',
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' }

const DoctorForm = ({ doctor = null, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: '',
        experience: '',
        phone: '',
        qualification: '',
        availableDays: [],
        availableTimeSlots: [],
    })
    const [slotStart, setSlotStart] = useState('09:00')
    const [slotEnd, setSlotEnd] = useState('13:00')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (doctor) {
            setFormData({
                name: doctor.name || '',
                email: doctor.email || '',
                specialization: doctor.specialization || '',
                experience: doctor.experience || '',
                phone: doctor.phone || '',
                qualification: doctor.qualification || '',
                availableDays: Array.isArray(doctor.availableDays) ? doctor.availableDays : [],
                availableTimeSlots: Array.isArray(doctor.availableTimeSlots) ? doctor.availableTimeSlots : [],
            })
        }
    }, [doctor])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const toggleDay = (day) => {
        setFormData(prev => ({
            ...prev,
            availableDays: prev.availableDays.includes(day)
                ? prev.availableDays.filter(d => d !== day)
                : [...prev.availableDays, day],
        }))
    }

    const addSlot = () => {
        if (!slotStart || !slotEnd) return
        if (slotStart >= slotEnd) { setError('End time must be after start time.'); return }
        const slot = `${slotStart}–${slotEnd}`
        if (formData.availableTimeSlots.includes(slot)) return
        setFormData(prev => ({ ...prev, availableTimeSlots: [...prev.availableTimeSlots, slot] }))
        setError('')
    }

    const removeSlot = (slot) => {
        setFormData(prev => ({ ...prev, availableTimeSlots: prev.availableTimeSlots.filter(s => s !== slot) }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!formData.name.trim() || !formData.specialization) {
            setError('Name and specialization are required.')
            return
        }
        setSubmitting(true)
        try {
            await onSubmit(formData)
        } catch (err) {
            setError(err.message || 'Failed to save doctor.')
        } finally {
            setSubmitting(false)
        }
    }

    const inputClass =
        'w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-800 text-sm transition-all'

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            style={{ animation: 'fadeIn 0.2s ease' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
                style={{ animation: 'slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                    <h2 className="text-lg font-black text-white">
                        {doctor ? '✏️ Edit Doctor' : '➕ Add New Doctor'}
                    </h2>
                    <button onClick={onClose}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* ── Basic Info ── */}
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Basic Information</p>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange}
                                    className={inputClass} placeholder="Dr. John Smith" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange}
                                    className={inputClass} placeholder="doctor@hospital.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Specialization <span className="text-red-500">*</span>
                                </label>
                                <select name="specialization" value={formData.specialization} onChange={handleChange}
                                    className={inputClass} required>
                                    <option value="">-- Select Specialization --</option>
                                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Qualification</label>
                                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange}
                                        className={inputClass} placeholder="MBBS, MD…" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Experience</label>
                                    <input type="text" name="experience" value={formData.experience} onChange={handleChange}
                                        className={inputClass} placeholder="e.g. 10 years" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                    className={inputClass} placeholder="+91 9876543210" />
                            </div>
                        </div>
                    </div>

                    {/* ── Available Days ── */}
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">📅 Available Days</p>
                        <div className="flex flex-wrap gap-2">
                            {DAYS.map(day => {
                                const active = formData.availableDays.includes(day)
                                return (
                                    <button key={day} type="button" onClick={() => toggleDay(day)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                                        style={{
                                            background: active ? 'linear-gradient(135deg,#6366f1,#7c3aed)' : '#f8fafc',
                                            color: active ? '#fff' : '#64748b',
                                            borderColor: active ? '#6366f1' : '#e2e8f0',
                                            transform: active ? 'scale(1.05)' : 'scale(1)',
                                        }}>
                                        {DAY_SHORT[day]}
                                    </button>
                                )
                            })}
                        </div>
                        {formData.availableDays.length === 0 && (
                            <p className="text-xs text-slate-400 mt-2 italic">No days selected yet.</p>
                        )}
                    </div>

                    {/* ── Time Slots ── */}
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                            <FaClock className="inline mr-1" />Time Slots
                        </p>

                        {/* Slot chips */}
                        {formData.availableTimeSlots.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.availableTimeSlots.map(slot => (
                                    <span key={slot}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2"
                                        style={{ background: '#f0fdf4', color: '#059669', borderColor: '#a7f3d0' }}>
                                        {slot}
                                        <button type="button" onClick={() => removeSlot(slot)}
                                            className="hover:text-red-500 transition-colors">
                                            <FaTrash className="text-[10px]" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Add slot row */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <label className="text-xs font-semibold text-gray-600">From</label>
                                <input type="time" value={slotStart} onChange={e => setSlotStart(e.target.value)}
                                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <label className="text-xs font-semibold text-gray-600">To</label>
                                <input type="time" value={slotEnd} onChange={e => setSlotEnd(e.target.value)}
                                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
                            </div>
                            <button type="button" onClick={addSlot}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105 hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg,#059669,#0891b2)' }}>
                                <FaPlus /> Add Slot
                            </button>
                        </div>
                        {formData.availableTimeSlots.length === 0 && (
                            <p className="text-xs text-slate-400 mt-2 italic">No time slots added yet.</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-bold text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex-1 px-4 py-2.5 text-white rounded-xl font-bold text-sm disabled:opacity-60 transition-all hover:opacity-90 hover:scale-105"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 16px #6366f140' }}>
                            {submitting ? 'Saving…' : (doctor ? 'Update Doctor' : 'Add Doctor')}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(24px) scale(0.97); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }
            `}</style>
        </div>
    )
}

export default DoctorForm
