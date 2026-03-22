import { useEffect, useState } from 'react'
import {
  FaArrowUp,
  FaCalendarCheck,
  FaClock,
  FaHome,
  FaNotesMedical,
  FaSignOutAlt,
  FaUserMd,
  FaUserShield
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllAppointments, getAllDoctors, getAllPatients } from '../services/api'

const STATUS_STYLE = {
  CONFIRMED: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)', label: '✓ Confirmed' },
  CANCELLED: { bg: 'rgba(244,63,94,0.15)', color: '#fb7185', border: 'rgba(244,63,94,0.3)', label: '✕ Cancelled' },
  PENDING: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)', label: '• Pending' },
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({ totalPatients: 0, totalDoctors: 0, totalAppointments: 0, pendingRecords: 5, revenue: 125600, occupancy: 85 })
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); fetchAdminData() }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const [patients, doctors, appointments] = await Promise.all([
        getAllPatients().catch(() => []),
        getAllDoctors().catch(() => []),
        getAllAppointments().catch(() => []),
      ])
      setStats({ totalPatients: patients.length, totalDoctors: doctors.length, totalAppointments: appointments.length, pendingRecords: 5, revenue: 125600, occupancy: 85 })
      setRecentAppointments(Array.isArray(appointments) ? appointments.slice(0, 5) : [])
    } catch (err) {
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const navItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: <FaCalendarCheck />, label: 'Appointments', path: '/appointments' },
    { icon: <FaUserMd />, label: 'Doctors', path: '/doctors' },
    { icon: <FaNotesMedical />, label: 'Records', path: '/medical-records' },
  ]

  const statCards = [
    { label: 'Total Patients', value: stats.totalPatients, icon: '🧑‍⚕️', gradient: 'from-indigo-500 to-violet-600', glow: 'shadow-indigo-500/40', trend: '+12%' },
    { label: 'Active Doctors', value: stats.totalDoctors, icon: '👨‍⚕️', gradient: 'from-emerald-400 to-teal-600', glow: 'shadow-emerald-500/40', trend: '+5' },
    { label: 'Appointments', value: stats.totalAppointments, icon: '📅', gradient: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/40', trend: 'Total' },
    { label: 'Bed Occupancy', value: `${stats.occupancy}%`, icon: '🏥', gradient: 'from-rose-400 to-pink-600', glow: 'shadow-rose-500/40', trend: 'Active' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #060b18 0%, #0a1628 35%, #071420 65%, #080e1c 100%)' }}>

      {/* Optional subtle grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.022]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }} />

      <header style={{
        background: 'rgba(8,14,32,0.85)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(19,200,236,0.12)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
      }}>
        {/* Animated top line */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, #13c8ec, #6366f1, #10b981)', backgroundSize: '200% 100%', animation: 'gradientShift 4s ease infinite' }} />
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-slide-right">
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #13c8ec, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(19,200,236,0.4)',
            }}>
              <FaUserShield style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            <div>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '1.05rem', lineHeight: 1.1 }}>Admin Portal</h1>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.7rem', fontWeight: 500 }}>HealthCare Pro</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, idx) => (
              <Link key={idx} to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600,
                  textDecoration: 'none', transition: 'all 0.2s',
                  background: item.active ? 'rgba(19,200,236,0.15)' : 'transparent',
                  color: item.active ? '#13c8ec' : 'rgba(255,255,255,0.55)',
                  border: item.active ? '1px solid rgba(19,200,236,0.25)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff' } }}
                onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' } }}>
                {item.icon}<span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>{user?.username || 'Admin'}</p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.7rem' }}>{user?.email}</p>
            </div>
            <button onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(244,63,94,0.25)',
                background: 'rgba(244,63,94,0.1)', color: '#fb7185',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}>
              <FaSignOutAlt /><span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8 animate-fade-up">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>
            Good day,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #13c8ec, #a78bfa, #34d399)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{user?.username || 'Admin'}!</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Here's your healthcare system overview.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map((card, i) => (
            <div key={i}
              className={`stat-card bg-gradient-to-br ${card.gradient} shadow-xl ${card.glow} animate-fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-white/80 text-sm font-semibold uppercase tracking-widest">{card.label}</p>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <p className="text-4xl font-black text-white mb-1 animate-count-up" style={{ animationDelay: `${i * 80 + 300}ms` }}>
                  {card.value}
                </p>
                <div className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                  <FaArrowUp className="text-white/50" />{card.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Appointments – dark glass card */}
          <div className="lg:col-span-2 animate-fade-up delay-300" style={{
            background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem',
          }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(19,200,236,0.15)', border: '1px solid rgba(19,200,236,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</span>
                Recent Appointments
              </h2>
              <Link to="/appointments" style={{
                padding: '6px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700,
                color: '#13c8ec', border: '1px solid rgba(19,200,236,0.3)', background: 'rgba(19,200,236,0.08)',
                textDecoration: 'none', transition: 'background 0.2s',
              }}>View All →</Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div style={{ width: '48px', height: '48px', border: '3px solid rgba(19,200,236,0.2)', borderTopColor: '#13c8ec', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Loading data...</p>
              </div>
            ) : recentAppointments.length === 0 ? (
              <div className="text-center py-12" style={{ border: '2px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
                <FaCalendarCheck style={{ color: 'rgba(255,255,255,0.1)', fontSize: '2.5rem', margin: '0 auto 12px' }} />
                <p style={{ color: 'rgba(255,255,255,0.3)' }}>No appointments found</p>
              </div>
            ) : (
              <table className="w-full table-row-animate">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Patient', 'Doctor', 'Time', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((apt) => {
                    const st = apt.status || 'PENDING'
                    const sts = STATUS_STYLE[st] || STATUS_STYLE.PENDING
                    return (
                      <tr key={apt.id}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(19,200,236,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '10px',
                              background: 'linear-gradient(135deg, #6366f1, #13c8ec)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                            }}>{(apt.patient?.name || 'P').charAt(0)}</div>
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{apt.patient?.name || 'Patient'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>{apt.doctor?.name || 'Doctor'}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
                            <FaClock style={{ color: '#13c8ec', fontSize: '0.7rem' }} />
                            {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700,
                            background: sts.bg, color: sts.color, border: `1px solid ${sts.border}`,
                          }}>{sts.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Side panel */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="animate-fade-up delay-400" style={{
              background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem',
            }}>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.05rem', marginBottom: '1.25rem' }}>Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { to: '/appointments', icon: '📅', label: 'View Appointments', sub: 'See all bookings', glow: '19,200,236' },
                  { to: '/doctors', icon: '👨‍⚕️', label: 'Manage Doctors', sub: 'Add or view doctors', glow: '16,185,129' },
                  { to: '/medical-records', icon: '📋', label: 'Medical Records', sub: 'View patient records', glow: '245,158,11' },
                ].map((action, i) => (
                  <Link key={i} to={action.to}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                      border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px',
                      textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `rgba(${action.glow},0.08)`; e.currentTarget.style.borderColor = `rgba(${action.glow},0.25)` }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>{action.label}</p>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: 0 }}>{action.sub}</p>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.875rem' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Hospital Stats */}
            <div className="animate-fade-up delay-500" style={{
              background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem',
            }}>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.05rem', marginBottom: '1.25rem' }}>Hospital Stats</h2>
              <div className="space-y-5">
                {/* Bed Occupancy */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Bed Occupancy</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#fff' }}>{stats.occupancy}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '99px',
                      background: 'linear-gradient(90deg, #13c8ec, #6366f1)',
                      width: mounted ? `${stats.occupancy}%` : '0%', transition: 'width 1s ease',
                      boxShadow: '0 0 12px rgba(19,200,236,0.5)',
                    }} />
                  </div>
                </div>
                {/* Revenue */}
                <div style={{
                  padding: '16px', borderRadius: '14px',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Monthly Revenue</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399' }}>₹{stats.revenue.toLocaleString()}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.75rem', fontWeight: 600, marginTop: '4px' }}>
                    <FaArrowUp /><span>+12.5% from last month</span>
                  </div>
                </div>
                {/* Mini bar chart */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '56px', paddingTop: '8px' }}>
                  {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 65, 88].map((h, i) => (
                    <div key={i} style={{
                      flex: 1, borderRadius: '4px 4px 0 0',
                      background: 'linear-gradient(to top, #13c8ec, #6366f1)',
                      height: mounted ? `${h}%` : '4px',
                      transition: `height 0.7s ease ${i * 50}ms`,
                      boxShadow: '0 0 8px rgba(19,200,236,0.3)',
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '-6px' }}>Appointments this year</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard