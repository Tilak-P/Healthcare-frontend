import { useEffect, useState } from 'react'
import {
    FaCalendarCheck,
    FaClock,
    FaFileMedical,
    FaHeartbeat,
    FaHistory,
    FaHome,
    FaNotesMedical,
    FaPills,
    FaPlusCircle,
    FaSignOutAlt,
    FaUserMd
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    getAppointmentsByPatientId,
    getMedicalRecordsByPatientId,
    getPatientByUserId
} from '../services/api'

const STATUS_STYLE = {
    CONFIRMED: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)', label: '✓ Confirmed' },
    CANCELLED: { bg: 'rgba(244,63,94,0.15)', color: '#fb7185', border: 'rgba(244,63,94,0.3)', label: '✕ Cancelled' },
    PENDING: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)', label: '• Pending' },
}

const PatientDashboard = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [displayName, setDisplayName] = useState('Patient')
    const [upcomingAppointments, setUpcomingAppointments] = useState([])
    const [medicalRecords, setMedicalRecords] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (user) {
            setDisplayName(user.username || user.email || 'Patient')
            fetchDashboardData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const patientData = await getPatientByUserId(user.id)
            if (patientData?.id) {
                const [appointments, records] = await Promise.all([
                    getAppointmentsByPatientId(patientData.id).catch(() => []),
                    getMedicalRecordsByPatientId(patientData.id).catch(() => []),
                ])
                setUpcomingAppointments(Array.isArray(appointments) ? appointments : [])
                setMedicalRecords(Array.isArray(records) ? records : [])
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => { logout(); navigate('/') }

    const navItems = [
        { icon: <FaHome />, label: 'Dashboard', path: '/patient-dashboard', active: true },
        { icon: <FaCalendarCheck />, label: 'Appointments', path: '/appointments' },
        { icon: <FaUserMd />, label: 'Doctors', path: '/doctors' },
        { icon: <FaNotesMedical />, label: 'Records', path: '/medical-records' },
    ]

    const quickActions = [
        { icon: <FaPlusCircle />, label: 'Book Appointment', gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/40', path: '/appointments' },
        { icon: <FaFileMedical />, label: 'View Records', gradient: 'from-emerald-400 to-teal-600', shadow: 'shadow-emerald-500/40', path: '/medical-records' },
        { icon: <FaPills />, label: 'Prescriptions', gradient: 'from-violet-500 to-purple-700', shadow: 'shadow-violet-500/40', path: '/medical-records' },
        { icon: <FaHistory />, label: 'History', gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/40', path: '/medical-records' },
    ]

    const latestRecord = medicalRecords.length > 0
        ? [...medicalRecords].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        : null



    return (
        <div className="min-h-screen relative" style={{ background: 'linear-gradient(160deg, #060b18 0%, #0a1628 35%, #071420 65%, #080e1c 100%)' }}>
            <div className="fixed inset-0 pointer-events-none opacity-[0.022]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />

            {/* Header */}
            <header style={{ background: 'rgba(8,14,32,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(19,200,236,0.12)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
                <div style={{ height: '2px', background: 'linear-gradient(90deg, #0ea5e9, #13c8ec, #6366f1)' }} />
                <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #0ea5e9, #13c8ec)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(19,200,236,0.4)' }}>
                            <FaHeartbeat style={{ color: '#fff', fontSize: '18px' }} />
                        </div>
                        <div>
                            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '1.05rem', lineHeight: 1.1 }}>Patient Portal</h1>
                            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.7rem' }}>HealthCare Pro</p>
                        </div>
                    </div>
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item, idx) => (
                            <Link key={idx} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', background: item.active ? 'rgba(19,200,236,0.15)' : 'transparent', color: item.active ? '#13c8ec' : 'rgba(255,255,255,0.55)', border: item.active ? '1px solid rgba(19,200,236,0.25)' : '1px solid transparent' }}
                                onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff' } }}
                                onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' } }}>
                                {item.icon}<span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2.5">
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #13c8ec, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>{(displayName).charAt(0).toUpperCase()}</div>
                            <div>
                                <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>{displayName}</p>
                                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.7rem' }}>Patient</p>
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
                        Welcome back,{' '}
                        <span style={{ background: 'linear-gradient(135deg, #13c8ec, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{displayName.split(' ')[0]}!</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Here's your personal health summary for today.</p>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action, idx) => (
                        <button key={idx} onClick={() => navigate(action.path)}
                            className="group flex flex-col items-center gap-3 p-6 rounded-2xl animate-fade-up"
                            style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', animationDelay: `${idx * 70 + 200}ms`, transition: 'all 0.2s', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(19,200,236,0.08)'; e.currentTarget.style.borderColor = 'rgba(19,200,236,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,15,35,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none' }}>
                            <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg ${action.shadow} group-hover:scale-110 transition-transform duration-300`}>
                                {action.icon}
                            </div>
                            <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', textAlign: 'center' }} className="group-hover:!text-white transition-colors">{action.label}</span>
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Appointments */}
                    <div className="animate-fade-up delay-400" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(19,200,236,0.15)', border: '1px solid rgba(19,200,236,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</span>
                                Upcoming Appointments
                            </h3>
                            <Link to="/appointments" style={{ color: '#13c8ec', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-center py-10">
                                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(19,200,236,0.2)', borderTopColor: '#13c8ec', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Loading...</p>
                                </div>
                            ) : upcomingAppointments.length === 0 ? (
                                <div className="text-center py-10" style={{ border: '2px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
                                    <FaCalendarCheck style={{ color: 'rgba(255,255,255,0.1)', fontSize: '2.5rem', margin: '0 auto 12px', display: 'block' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>No appointments yet</p>
                                    <button onClick={() => navigate('/appointments')} style={{ marginTop: '12px', padding: '8px 18px', borderRadius: '12px', background: 'rgba(19,200,236,0.1)', color: '#13c8ec', border: '1px solid rgba(19,200,236,0.2)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>+ Book now</button>
                                </div>
                            ) : upcomingAppointments.slice(0, 3).map((apt, i) => {
                                const st = apt.status || 'PENDING'
                                const sts = STATUS_STYLE[st] || STATUS_STYLE.PENDING
                                return (
                                    <div key={apt.id} className="flex items-center gap-3 animate-row-in"
                                        style={{ padding: '14px', borderRadius: '14px', animationDelay: `${i * 60}ms`, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(19,200,236,0.06)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                                        <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #0ea5e9, #13c8ec)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FaUserMd style={{ color: '#fff' }} /></div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem' }}>{apt.doctor?.name || 'General Doctor'}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                <FaClock style={{ fontSize: '0.65rem' }} />
                                                {new Date(apt.appointmentDate).toLocaleDateString()} · {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, background: sts.bg, color: sts.color, border: `1px solid ${sts.border}`, flexShrink: 0 }}>{sts.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Medical Records */}
                    <div className="animate-fade-up delay-500" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📋</span>
                                Medical History
                            </h3>
                            <Link to="/medical-records" style={{ color: '#34d399', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
                        </div>
                        {loading ? (
                            <div className="text-center py-10">
                                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Loading records...</p>
                            </div>
                        ) : medicalRecords.length === 0 ? (
                            <div className="text-center py-10" style={{ border: '2px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
                                <FaFileMedical style={{ color: 'rgba(255,255,255,0.1)', fontSize: '2.5rem', margin: '0 auto 12px', display: 'block' }} />
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>No medical records found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {medicalRecords.slice(0, 3).map((record, i) => (
                                    <div key={record.id} className="animate-row-in"
                                        style={{ padding: '14px', borderRadius: '14px', animationDelay: `${i * 60}ms`, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.06)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem' }}>🩺 {record.diagnosis || 'No diagnosis'}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>by {record.doctor?.name || 'Doctor'}{record.doctor?.specialization ? ` · ${record.doctor.specialization}` : ''}</p>
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: '99px', marginLeft: '8px', whiteSpace: 'nowrap' }}>{record.date ? new Date(record.date).toLocaleDateString() : '—'}</span>
                                        </div>
                                        {record.prescription && (
                                            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '10px', padding: '8px 12px' }}>
                                                <FaPills style={{ color: '#c084fc', fontSize: '0.75rem', marginTop: '2px', flexShrink: 0 }} />
                                                <p style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 500 }}>{record.prescription}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {!loading && latestRecord?.prescription && (
                    <div className="mt-6 animate-fade-up delay-600 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #a855f7 100%)', borderRadius: '20px', boxShadow: '0 8px 32px rgba(124,58,237,0.35)' }}>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        <div className="relative z-10 p-5 flex items-start gap-4">
                            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.5rem' }}>💊</div>
                            <div>
                                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Latest Prescription</h3>
                                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.5 }}>{latestRecord.prescription}</p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '6px' }}>Prescribed by {latestRecord.doctor?.name || 'Doctor'} · {latestRecord.date ? new Date(latestRecord.date).toLocaleDateString() : ''}</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default PatientDashboard
