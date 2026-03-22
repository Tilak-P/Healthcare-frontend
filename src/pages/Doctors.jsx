import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  FaEdit,
  FaEnvelope,
  FaGraduationCap,
  FaPhone,
  FaSearch,
  FaStar,
  FaStethoscope,
  FaTrash,
  FaUserMd,
  FaUserPlus
} from 'react-icons/fa'
import DoctorForm from '../components/Forms/DoctorForm'
import { useAuth } from '../context/AuthContext'
import { createDoctor, deleteDoctor, getAllDoctors, updateDoctor } from '../services/api'

// Color pool for doctor avatar gradients
const GRAD_POOL = [
  'linear-gradient(135deg,#6366f1,#818cf8)',
  'linear-gradient(135deg,#10b981,#34d399)',
  'linear-gradient(135deg,#f59e0b,#fbbf24)',
  'linear-gradient(135deg,#f43f5e,#fb7185)',
  'linear-gradient(135deg,#0891b2,#22d3ee)',
  'linear-gradient(135deg,#7c3aed,#a78bfa)',
]

const DoctorCard = ({ doctor, isAdmin, onEdit, onDelete, index }) => {
  const cardRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const grad = GRAD_POOL[index % GRAD_POOL.length]

  const handleMouseMove = (e) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2)
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2)
    setRotate({ x: -dy * 8, y: dx * 8 })
  }

  return (
    <div style={{ perspective: '800px', animation: 'fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both', animationDelay: `${index * 60}ms` }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setRotate({ x: 0, y: 0 }); setHovered(false) }}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${hovered ? 'scale(1.03)' : 'scale(1)'}`,
          transition: hovered ? 'transform 0.08s linear' : 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="bg-white rounded-2xl overflow-hidden"
        style2={{
          boxShadow: hovered ? '0 20px 48px rgba(99,102,241,0.18), 0 4px 16px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.06)',
          border: hovered ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Card inner */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: '#fff',
            boxShadow: hovered
              ? '0 20px 48px rgba(99,102,241,0.18), 0 4px 16px rgba(0,0,0,0.06)'
              : '0 2px 8px rgba(0,0,0,0.06)',
            border: hovered ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.3s, border-color 0.3s',
          }}>

          {/* Gradient header strip */}
          <div className="h-20 relative" style={{ background: grad }}>
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4), transparent)' }} />
            {/* Avatar */}
            <div className="absolute -bottom-7 left-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl border-4 border-white"
                style={{
                  background: grad,
                  transform: `translateZ(${hovered ? 20 : 0}px)`,
                  transition: 'transform 0.4s ease',
                }}>
                {(doctor.name || 'D').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="pt-10 px-5 pb-5">
            {/* Name + specialty */}
            <div className="mb-3">
              <h3 className="font-black text-slate-900 text-base">{doctor.name || 'Unknown'}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <FaStethoscope className="text-xs" style={{ color: '#6366f1' }} />
                <span className="text-xs font-bold" style={{ color: '#6366f1' }}>
                  {doctor.specialization || 'General Medicine'}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              {doctor.qualification && (
                <div className="flex items-center gap-2 text-sm">
                  <FaGraduationCap className="text-amber-400 flex-shrink-0" />
                  <span className="text-slate-600 truncate">{doctor.qualification}</span>
                </div>
              )}
              {doctor.experience && (
                <div className="flex items-center gap-2 text-sm">
                  <FaStar className="text-indigo-400 flex-shrink-0" />
                  <span className="text-slate-600">{doctor.experience}</span>
                </div>
              )}
              {doctor.email && (
                <div className="flex items-center gap-2 text-sm">
                  <FaEnvelope className="text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-600 truncate">{doctor.email}</span>
                </div>
              )}
              {doctor.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <FaPhone className="text-cyan-400 flex-shrink-0" />
                  <span className="text-slate-600">{doctor.phone}</span>
                </div>
              )}
            </div>

            {/* Schedule section */}
            {(() => {
              const days = Array.isArray(doctor.availableDays) ? doctor.availableDays : []
              const slots = Array.isArray(doctor.availableTimeSlots) ? doctor.availableTimeSlots : []
              const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
              const DAY_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' }

              if (days.length === 0 && slots.length === 0) {
                return (
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0" />
                    <span className="text-xs text-slate-400 italic">Schedule not set</span>
                  </div>
                )
              }

              return (
                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {days.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {days.map(day => {
                        const isToday = day === todayName
                        return (
                          <span key={day}
                            style={{
                              padding: '3px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700,
                              background: isToday ? 'linear-gradient(135deg,#10b981,#13c8ec)' : 'rgba(255,255,255,0.06)',
                              color: isToday ? '#fff' : 'rgba(255,255,255,0.4)',
                              border: isToday ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            }}>
                            {DAY_SHORT[day] || day}
                          </span>
                        )
                      })}
                    </div>
                  )}
                  {slots.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {slots.map(slot => (
                        <span key={slot}
                          style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                          🕐 {slot}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Admin actions */}
            {isAdmin && (
              <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button onClick={() => onEdit(doctor)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}>
                  <FaEdit /> Edit
                </button>
                <button onClick={() => onDelete(doctor.id)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}>
                  <FaTrash /> Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Doctors = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [doctors, setDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)

  const fetchDoctors = async () => {
    try {
      setLoading(true); setError(null)
      const data = await getAllDoctors()
      setDoctors(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load doctors. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDoctors() }, [])

  const handleFormSubmit = async (formData) => {
    try {
      if (editingDoctor) { await updateDoctor(editingDoctor.id, formData); toast.success('Doctor updated!') }
      else { await createDoctor(formData); toast.success('Doctor added!') }
      setShowForm(false); setEditingDoctor(null); fetchDoctors()
    } catch (err) {
      toast.error('Failed to save doctor: ' + (err.message || 'Unknown error'))
      throw err
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this doctor?')) return
    try { await deleteDoctor(id); toast.success('Doctor removed!'); fetchDoctors() }
    catch (err) { toast.error('Failed: ' + (err.message || 'Unknown')) }
  }

  const specialties = [...new Set(doctors.map(d => d.specialization).filter(Boolean))]
  const filteredDoctors = doctors.filter(d =>
    ((d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.specialization || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterSpecialty === 'all' || d.specialization === filterSpecialty)
  )

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
              <span style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(99,102,241,0.4)', flexShrink: 0 }}><FaUserMd style={{ color: '#fff', fontSize: '16px' }} /></span>
              Our Doctors
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.875rem', marginTop: '2px' }}>
              {loading ? 'Loading…' : `${filteredDoctors.length} specialist${filteredDoctors.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
        </div>
        {isAdmin && (
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', color: '#fff', fontWeight: 700, fontSize: '0.9rem', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onClick={() => { setEditingDoctor(null); setShowForm(true) }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <FaUserPlus /> Add Doctor
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="animate-fade-up delay-100" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px 20px' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px 16px', flex: 1, maxWidth: '400px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <FaSearch style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input type="text" placeholder="Search by name or specialization…"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', width: '100%', outline: 'none', border: 'none', color: '#fff', fontSize: '0.875rem' }} />
          </div>
          <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 16px', color: '#fff', fontSize: '0.875rem', outline: 'none', cursor: 'pointer' }}>
            <option value="all" style={{ background: '#0a1628' }}>All Specialties</option>
            {specialties.map(s => <option key={s} value={s} style={{ background: '#0a1628' }}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div style={{ width: '52px', height: '52px', border: '3px solid rgba(99,102,241,0.15)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading doctors…</p>
        </div>
      ) : error ? (
        <div className="text-center py-16" style={{ background: 'rgba(10,15,35,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem' }}>
          <p style={{ color: '#fb7185', marginBottom: '16px' }}>{error}</p>
          <button onClick={fetchDoctors} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-16 animate-fade-up" style={{ background: 'rgba(10,15,35,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FaUserMd style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.75rem' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>No doctors found</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.875rem', marginTop: '4px' }}>
            {isAdmin ? 'Click "Add Doctor" to register a new one.' : 'No doctors are currently registered.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doctor, i) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              isAdmin={isAdmin}
              index={i}
              onEdit={(d) => { setEditingDoctor(d); setShowForm(true) }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <DoctorForm
          doctor={editingDoctor}
          onClose={() => { setShowForm(false); setEditingDoctor(null) }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}

export default Doctors