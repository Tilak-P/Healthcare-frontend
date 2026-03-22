import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  FaCalendarAlt,
  FaCalendarPlus,
  FaCheckCircle,
  FaSearch,
  FaSpinner,
  FaTimesCircle
} from 'react-icons/fa'
import AppointmentForm from '../components/Forms/AppointmentForm'
import { useAuth } from '../context/AuthContext'
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsByPatientId,
  getPatientByUserId,
  updateAppointmentStatus
} from '../services/api'

const STATUS_META = {
  CONFIRMED: { label: '✓ Confirmed', bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
  CANCELLED: { label: '✕ Cancelled', bg: 'rgba(244,63,94,0.15)', color: '#fb7185', border: 'rgba(244,63,94,0.3)' },
  PENDING: { label: '• Pending', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
}

const Appointments = () => {
  const { user } = useAuth()
  const canBook = user?.role === 'PATIENT'
  const canChangeStatus = user?.role === 'DOCTOR' || user?.role === 'ADMIN'

  const [searchTerm, setSearchTerm] = useState('')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)  // tracks which row is being updated

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      let data = []
      if (user?.role === 'PATIENT') {
        // Patients only see their own appointments
        const patientData = await getPatientByUserId(user.id).catch(() => null)
        if (patientData?.id) {
          data = await getAppointmentsByPatientId(patientData.id).catch(() => [])
        }
      } else {
        data = await getAllAppointments()
      }
      setAppointments(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load appointments:', err)
      setError('Failed to load appointments. Please try again.')
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleCreate = async (appointmentData) => {
    try {
      await createAppointment(appointmentData)
      toast.success('Appointment booked successfully!')
      setShowForm(false)
      fetchAppointments()
    } catch (err) {
      toast.error('Failed to book appointment: ' + (err.message || 'Unknown error'))
    }
  }

  const handleStatusChange = async (id, status) => {
    // Optimistic update — change the badge immediately
    const previous = appointments.find(a => a.id === id)?.status
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    setUpdatingId(id)
    try {
      await updateAppointmentStatus(id, status)
      toast.success(status === 'CONFIRMED' ? '✅ Appointment confirmed!' : '❌ Appointment cancelled.')
    } catch (err) {
      // Rollback on failure
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: previous } : a))
      toast.error('Failed to update: ' + (err.message || 'Please restart the backend server.'))
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try { return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
    catch { return dateStr }
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    try { return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
    catch { return '' }
  }

  const filteredAppointments = appointments.filter((app) => {
    const doctorName = app.doctor?.name || ''
    const patientName = app.patient?.name || ''
    const desc = app.description || ''
    return (
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()}
            style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(19,200,236,0.1)'; e.currentTarget.style.color = '#13c8ec' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}>
            ←
          </button>
          <div>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0ea5e9, #13c8ec)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(19,200,236,0.35)', flexShrink: 0 }}><FaCalendarAlt style={{ color: '#fff', fontSize: '16px' }} /></span>
              Appointments
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.875rem', marginTop: '2px' }}>View and manage patient appointments</p>
          </div>
        </div>
        {canBook && (
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', color: '#fff', fontWeight: 700, fontSize: '0.9rem', background: 'linear-gradient(135deg, #0ea5e9, #13c8ec)', boxShadow: '0 4px 20px rgba(19,200,236,0.4)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onClick={() => setShowForm(true)}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <FaCalendarPlus /> New Appointment
          </button>
        )}
      </div>

      {/* Search */}
      <div className="animate-fade-up delay-100" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px 16px', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <FaSearch style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input type="text" placeholder="Search by doctor, patient, or description..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', width: '100%', outline: 'none', border: 'none', color: '#fff', fontSize: '0.875rem' }} />
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-up delay-200" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem' }}>
        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(19,200,236,0.15)', border: '1px solid rgba(19,200,236,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</span>
          All Appointments <span style={{ color: 'rgba(19,200,236,0.7)' }}>({filteredAppointments.length})</span>
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div style={{ width: '48px', height: '48px', border: '3px solid rgba(19,200,236,0.15)', borderTopColor: '#13c8ec', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p style={{ color: '#fb7185', marginBottom: '12px' }}>{error}</p>
            <button onClick={fetchAppointments} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #0ea5e9, #13c8ec)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12" style={{ border: '2px dashed rgba(255,255,255,0.07)', borderRadius: '16px' }}>
            <FaCalendarAlt style={{ color: 'rgba(255,255,255,0.08)', fontSize: '3rem', margin: '0 auto 12px', display: 'block' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Patient', 'Doctor', 'Date & Time', 'Description', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => {
                  const sm = STATUS_META[apt.status] || STATUS_META.PENDING
                  return (
                    <tr key={apt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '0.8rem', flexShrink: 0 }}>
                            {(apt.patient?.name || 'P').charAt(0)}
                          </div>
                          <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{apt.patient?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>{apt.doctor?.name || 'N/A'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{formatDate(apt.appointmentDate)}</p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{formatTime(apt.appointmentDate)}</p>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.description || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        {updatingId === apt.id ? (
                          <FaSpinner style={{ animation: 'spin 0.8s linear infinite', color: '#13c8ec' }} />
                        ) : (
                          <span style={{ padding: '5px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}>{sm.label}</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {canChangeStatus && apt.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleStatusChange(apt.id, 'CONFIRMED')}
                                style={{ padding: '6px 14px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}>
                                <FaCheckCircle /> Confirm
                              </button>
                              <button onClick={() => handleStatusChange(apt.id, 'CANCELLED')}
                                style={{ padding: '6px 14px', borderRadius: '10px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}>
                                <FaTimesCircle /> Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <AppointmentForm
          appointment={null}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  )

}

export default Appointments