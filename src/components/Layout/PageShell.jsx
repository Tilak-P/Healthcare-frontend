import { useState } from 'react'
import { FaBars, FaCalendarCheck, FaHeartbeat, FaHome, FaNotesMedical, FaSignOutAlt, FaTimes, FaUserMd, FaUserShield } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const roleConfig = {
    PATIENT: {
        accent: '#13c8ec',
        accentGlow: 'rgba(19,200,236,0.3)',
        label: 'Patient Portal',
        icon: <FaHeartbeat />,
        nav: [
            { icon: <FaHome />, label: 'Dashboard', path: '/patient-dashboard' },
            { icon: <FaCalendarCheck />, label: 'Appointments', path: '/appointments' },
            { icon: <FaUserMd />, label: 'Doctors', path: '/doctors' },
            { icon: <FaNotesMedical />, label: 'Records', path: '/medical-records' },
        ]
    },
    DOCTOR: {
        accent: '#10b981',
        accentGlow: 'rgba(16,185,129,0.3)',
        label: 'Doctor Portal',
        icon: <FaUserMd />,
        nav: [
            { icon: <FaHome />, label: 'Dashboard', path: '/doctor-dashboard' },
            { icon: <FaCalendarCheck />, label: 'Appointments', path: '/appointments' },
            { icon: <FaNotesMedical />, label: 'Records', path: '/medical-records' },
        ]
    },
    ADMIN: {
        accent: '#a78bfa',
        accentGlow: 'rgba(167,139,250,0.3)',
        label: 'Admin Portal',
        icon: <FaUserShield />,
        nav: [
            { icon: <FaHome />, label: 'Dashboard', path: '/admin-dashboard' },
            { icon: <FaCalendarCheck />, label: 'Appointments', path: '/appointments' },
            { icon: <FaUserMd />, label: 'Doctors', path: '/doctors' },
            { icon: <FaNotesMedical />, label: 'Records', path: '/medical-records' },
            { icon: <FaUserMd />, label: 'Patients', path: '/patients' },
        ]
    }
}

const PageShell = ({ children }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const role = user?.role || 'PATIENT'
    const cfg = roleConfig[role] || roleConfig.PATIENT
    const currentPath = window.location.pathname

    const handleLogout = () => { logout(); navigate('/') }

    return (
        <div style={{ height: '100vh', background: 'linear-gradient(160deg, #060b18 0%, #0a1628 50%, #080e1c 100%)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

            {/* ── Header ── */}
            <header style={{ background: 'rgba(6,11,24,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
                {/* Accent top bar */}
                <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)` }} />

                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.1)', color: cfg.accent }}>
                            {cfg.icon}
                        </div>
                        <div>
                            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '1rem', lineHeight: 1.2 }}>{cfg.label}</h1>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 500 }}>HealthCare Pro</p>
                        </div>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {cfg.nav.map((item, idx) => {
                            const active = currentPath === item.path
                            return (
                                <Link key={idx} to={item.path}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600,
                                        transition: 'all 0.2s',
                                        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        color: active ? cfg.accent : 'rgba(255,255,255,0.55)',
                                        border: active ? `1px solid ${cfg.accent}44` : '1px solid transparent',
                                        boxShadow: active ? `0 0 12px ${cfg.accentGlow}` : 'none',
                                        textDecoration: 'none',
                                    }}>
                                    {item.icon}<span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-3">
                            <div style={{ width: '34px', height: '34px', background: `${cfg.accent}22`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.875rem', color: cfg.accent, border: `1px solid ${cfg.accent}44` }}>
                                {(user?.username || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.2 }}>{user?.username || user?.email}</p>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{role}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.color = '#fb7185'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
                            <FaSignOutAlt /><span className="hidden md:inline">Logout</span>
                        </button>
                        {/* Mobile menu button */}
                        <button className="lg:hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }} onClick={() => setMobileOpen(v => !v)}>
                            {mobileOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className="lg:hidden px-4 py-3 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        {cfg.nav.map((item, idx) => (
                            <Link key={idx} to={item.path} onClick={() => setMobileOpen(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, color: currentPath === item.path ? cfg.accent : 'rgba(255,255,255,0.55)', background: currentPath === item.path ? 'rgba(255,255,255,0.08)' : 'transparent', textDecoration: 'none' }}>
                                {item.icon}<span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            {/* ── Page content ── */}
            <main style={{ flex: 1, padding: '24px 16px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
                <div className="animate-fade-up">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default PageShell
