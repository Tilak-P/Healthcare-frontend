import { useEffect, useState } from 'react'
import {
    FaCalendarAlt,
    FaCalendarCheck,
    FaCheckCircle,
    FaClipboardList,
    FaClock,
    FaEdit,
    FaFileMedical,
    FaFileMedicalAlt,
    FaHome,
    FaSignOutAlt,
    FaStethoscope,
    FaTimes,
    FaTimesCircle,
    FaUserInjured
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import DoctorForm from '../components/Forms/DoctorForm'
import MedicalRecordForm from '../components/Forms/MedicalRecordForm'
import { useAuth } from '../context/AuthContext'
import { createMedicalRecord, getAppointmentsByDoctorId, getDoctorByUserId, updateDoctor } from '../services/api'

const ST_STYLE = {
    CONFIRMED: { label: '✓ Confirmed', bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
    CANCELLED: { label: '✕ Cancelled', bg: 'rgba(244,63,94,0.15)', color: '#fb7185', border: 'rgba(244,63,94,0.3)' },
    PENDING: { label: '• Pending', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
}

const DoctorDashboard = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewingApt, setViewingApt] = useState(null)
    const [showRecordForm, setShowRecordForm] = useState(false)
    const [showScheduleForm, setShowScheduleForm] = useState(false)
    const [doctorData, setDoctorData] = useState(null)
    useEffect(() => {
        if (user) fetchDoctorData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const fetchDoctorData = async () => {
        try {
            setLoading(true)
            const data = await getDoctorByUserId(user.id)
            setDoctorData(data || null)
            if (data?.id) {
                const results = await getAppointmentsByDoctorId(data.id)
                setAppointments(Array.isArray(results) ? results : [])
            }
        } catch (err) {
            console.error('Error fetching doctor data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => { logout(); navigate('/') }

    const handleAddRecord = async (recordData) => {
        try {
            await createMedicalRecord(recordData)
            setShowRecordForm(false)
            alert('Medical record saved! The patient can now view it.')
        } catch (err) {
            alert('Failed to save record: ' + (err.message || 'Unknown error'))
        }
    }

    const handleScheduleUpdate = async (formData) => {
        if (!doctorData?.id) return
        await updateDoctor(doctorData.id, formData)
        setShowScheduleForm(false)
        // Refresh doctor data
        const refreshed = await getDoctorByUserId(user.id)
        setDoctorData(refreshed || null)
    }

    const navItems = [
        { icon: <FaHome />, label: 'Dashboard', path: '/doctor-dashboard', active: true },
        { icon: <FaCalendarCheck />, label: 'Appointments', path: '/appointments' },
        { icon: <FaFileMedical />, label: 'Records', path: '/medical-records' },
    ]

    const statCards = [
        { label: 'Total', value: appointments.length, icon: '📅', gradient: 'from-indigo-500 to-violet-600', glow: 'shadow-indigo-500/40' },
        { label: 'Pending', value: appointments.filter(a => (a.status || 'PENDING') === 'PENDING').length, icon: '⏳', gradient: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/40' },
        { label: 'Confirmed', value: appointments.filter(a => a.status === 'CONFIRMED').length, icon: '✅', gradient: 'from-emerald-400 to-teal-600', glow: 'shadow-emerald-500/40' },
        { label: 'Cancelled', value: appointments.filter(a => a.status === 'CANCELLED').length, icon: '❌', gradient: 'from-rose-400 to-pink-600', glow: 'shadow-rose-500/40' },
    ]

    const formatDate = (dt) => dt ? new Date(dt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
    const formatTime = (dt) => dt ? new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'

    return (
        <div className="min-h-screen relative" style={{ background: 'linear-gradient(160deg, #060b18 0%, #0a1628 35%, #071420 65%, #080e1c 100%)' }}>
            <div className="fixed inset-0 pointer-events-none opacity-[0.022]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />

            {/* Header */}
            <header style={{ background: 'rgba(8,14,32,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(16,185,129,0.15)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
                <div style={{ height: '2px', background: 'linear-gradient(90deg, #10b981, #13c8ec, #6366f1)' }} />
                <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #13c8ec)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(16,185,129,0.4)' }}>
                            <FaStethoscope style={{ color: '#fff', fontSize: '18px' }} />
                        </div>
                        <div>
                            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '1.05rem', lineHeight: 1.1 }}>Doctor Portal</h1>
                            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.7rem' }}>HealthCare Pro</p>
                        </div>
                    </div>
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item, idx) => (
                            <Link key={idx} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', background: item.active ? 'rgba(16,185,129,0.15)' : 'transparent', color: item.active ? '#10b981' : 'rgba(255,255,255,0.55)', border: item.active ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent' }}
                                onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff' } }}
                                onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' } }}>
                                {item.icon}<span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2.5">
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #13c8ec)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>{(user?.username || 'D').charAt(0).toUpperCase()}</div>
                            <div>
                                <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>Dr. {user?.username || 'Doctor'}</p>
                                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.7rem' }}>Doctor</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(244,63,94,0.25)', background: 'rgba(244,63,94,0.1)', color: '#fb7185', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}>
                            <FaSignOutAlt /><span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-4 py-8">

                {/* Welcome */}
                <div className="mb-8 animate-fade-up">
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>
                        Good day,{' '}
                        <span style={{ background: 'linear-gradient(135deg, #10b981, #13c8ec, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dr. {user?.username || 'Doctor'}!</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Here's your appointment schedule for today.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((card, i) => (
                        <div key={i} className={`stat-card bg-gradient-to-br ${card.gradient} shadow-lg ${card.glow} animate-fade-up`}
                            style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest">{card.label}</p>
                                    <span className="text-xl">{card.icon}</span>
                                </div>
                                <p className="text-4xl font-black text-white animate-count-up" style={{ animationDelay: `${i * 80 + 300}ms` }}>
                                    {loading ? '—' : card.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* My Schedule Card */}
                <div className="animate-fade-up delay-200 mb-8" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</span>
                            My Schedule
                        </h3>
                        <button onClick={() => setShowScheduleForm(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)', cursor: 'pointer', border: 'none', transition: 'opacity 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                            <FaEdit /> Edit Schedule
                        </button>
                    </div>

                    {loading ? (
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>Loading schedule…</p>
                    ) : (() => {
                        const days = Array.isArray(doctorData?.availableDays) ? doctorData.availableDays : []
                        const slots = Array.isArray(doctorData?.availableTimeSlots) ? doctorData.availableTimeSlots : []
                        const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
                        const DAY_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' }

                        if (days.length === 0 && slots.length === 0) {
                            return (
                                <div className="text-center py-6" style={{ border: '2px dashed rgba(255,255,255,0.08)', borderRadius: '14px' }}>
                                    <FaClock style={{ color: 'rgba(255,255,255,0.1)', fontSize: '2rem', margin: '0 auto 8px', display: 'block' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>No schedule set. Click <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Edit Schedule</strong> to configure.</p>
                                </div>
                            )
                        }
                        return (
                            <div className="space-y-3">
                                {days.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Available Days</p>
                                        <div className="flex flex-wrap gap-2">
                                            {days.map(day => {
                                                const isToday = day === todayName
                                                return (
                                                    <span key={day} style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, background: isToday ? 'linear-gradient(135deg,#10b981,#13c8ec)' : 'rgba(255,255,255,0.06)', color: isToday ? '#fff' : 'rgba(255,255,255,0.45)', border: isToday ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                                                        {DAY_SHORT[day] || day}{isToday ? ' · Today' : ''}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                                {slots.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Time Slots</p>
                                        <div className="flex flex-wrap gap-2">
                                            {slots.map(slot => (
                                                <span key={slot} style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                                                    🕐 {slot}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })()}
                </div>

                {/* Appointments List */}
                <div className="animate-fade-up delay-300" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗓️</span>
                            My Appointments
                        </h3>
                        <Link to="/appointments" style={{ color: '#34d399', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>View Full Schedule →</Link>
                    </div>

                    <div className="space-y-2.5">
                        {loading ? (
                            <div className="text-center py-12">
                                <div style={{ width: '48px', height: '48px', border: '3px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                                <p style={{ color: 'rgba(255,255,255,0.35)' }}>Loading schedule...</p>
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-12" style={{ border: '2px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
                                <FaCalendarAlt style={{ color: 'rgba(255,255,255,0.1)', fontSize: '2.5rem', margin: '0 auto 12px', display: 'block' }} />
                                <p style={{ color: 'rgba(255,255,255,0.3)' }}>No appointments found</p>
                            </div>
                        ) : appointments.slice(0, 6).map((apt, i) => {
                            const st = apt.status || 'PENDING'
                            const stStyle = ST_STYLE[st] || ST_STYLE.PENDING
                            return (
                                <div key={apt.id}
                                    className="flex items-center gap-4 p-4 rounded-xl animate-row-in"
                                    style={{ background: 'rgba(255,255,255,0.04)', borderLeft: `3px solid ${stStyle.color}`, animationDelay: `${i * 50}ms`, transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.06)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                                    <div style={{ width: '60px', textAlign: 'center', flexShrink: 0 }}>
                                        <p style={{ fontWeight: 900, color: '#fff', fontSize: '0.875rem' }}>{formatTime(apt.appointmentDate)}</p>
                                        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{formatDate(apt.appointmentDate)}</p>
                                    </div>
                                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #13c8ec)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '0.875rem', flexShrink: 0 }}>
                                        {(apt.patient?.name || 'P').charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{apt.patient?.name || apt.description || 'Patient'}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{apt.description || 'Consultation'}</p>
                                    </div>
                                    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700, background: stStyle.bg, color: stStyle.color, border: `1px solid ${stStyle.border}`, flexShrink: 0 }}>{stStyle.label}</span>
                                    <button onClick={() => setViewingApt(apt)}
                                        style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #10b981, #13c8ec)', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'opacity 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                        View
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>

            {/* ── Appointment Detail Modal ── */}
            {viewingApt && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">

                        {/* Modal header */}
                        <div className="p-5 flex items-center justify-between text-white"
                            style={{ background: 'linear-gradient(135deg, #059669, #0891b2)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FaCalendarCheck />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black">Appointment Details</h2>
                                    <p className="text-white/70 text-xs">Booked appointment</p>
                                </div>
                            </div>
                            <button onClick={() => setViewingApt(null)}
                                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Status banner */}
                        <div className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold ${(viewingApt.status || 'PENDING') === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-100'
                            : (viewingApt.status === 'CANCELLED')
                                ? 'bg-rose-50 text-rose-600 border-b border-rose-100'
                                : 'bg-amber-50 text-amber-700 border-b border-amber-100'}`}>
                            {(viewingApt.status || 'PENDING') === 'CONFIRMED' ? <><FaCheckCircle /> Appointment Confirmed</> :
                                viewingApt.status === 'CANCELLED' ? <><FaTimesCircle /> Appointment Cancelled</> :
                                    <><FaClipboardList /> Appointment Pending</>}
                        </div>

                        {/* Details grid */}
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Patient', value: viewingApt.patient?.name || 'Unknown', icon: <FaUserInjured className="text-indigo-400" /> },
                                    { label: 'Date', value: formatDate(viewingApt.appointmentDate), icon: <FaCalendarAlt className="text-emerald-400" /> },
                                    { label: 'Time', value: formatTime(viewingApt.appointmentDate), icon: <FaClock className="text-amber-400" /> },
                                    { label: 'Status', value: viewingApt.status || 'PENDING', icon: <FaCheckCircle className="text-blue-400" /> },
                                ].map(({ label, value, icon }) => (
                                    <div key={label} className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{label}</p>
                                        <p className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">{icon} {value}</p>
                                    </div>
                                ))}
                            </div>

                            {viewingApt.description && (
                                <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-100">
                                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">Reason / Notes</p>
                                    <p className="text-sm text-slate-800">{viewingApt.description}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button onClick={() => setViewingApt(null)}
                                    className="flex-1 py-3 text-sm border-2 border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors font-bold">
                                    Close
                                </button>
                                <button
                                    onClick={() => { setViewingApt(null); setShowRecordForm(true); window._aptPatientId = viewingApt.patient?.id }}
                                    className="flex-1 py-3 text-sm text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-105 shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #059669, #0891b2)' }}>
                                    <FaFileMedicalAlt /> Add Record
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add Medical Record Modal ── */}
            {showRecordForm && (
                <MedicalRecordForm
                    record={null}
                    prefilledPatientId={window._aptPatientId}
                    onClose={() => { setShowRecordForm(false); window._aptPatientId = null }}
                    onSubmit={handleAddRecord}
                />
            )}

            {/* ── Edit Schedule Modal ── */}
            {showScheduleForm && (
                <DoctorForm
                    doctor={doctorData}
                    onClose={() => setShowScheduleForm(false)}
                    onSubmit={handleScheduleUpdate}
                />
            )}
        </div>
    )
}

export default DoctorDashboard
