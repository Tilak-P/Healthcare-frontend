import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaEdit, FaEye, FaFileMedical, FaFileMedicalAlt, FaSearch, FaTrash } from 'react-icons/fa'
import MedicalRecordForm from '../components/Forms/MedicalRecordForm'
import { useAuth } from '../context/AuthContext'
import {
  createMedicalRecord,
  deleteMedicalRecord,
  getAllMedicalRecords,
  getDoctorByUserId,
  updateMedicalRecord
} from '../services/api'

const MedicalRecords = () => {
  const { user } = useAuth()
  const isDoctor = user?.role === 'DOCTOR'
  const canAddRecord = user?.role === 'DOCTOR'
  const [searchTerm, setSearchTerm] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [viewingRecord, setViewingRecord] = useState(null)

  const fetchRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      let data = []
      if (isDoctor && user?.id) {
        // Doctors see only records they created (filtered by doctorId)
        const doctorData = await getDoctorByUserId(user.id).catch(() => null)
        if (doctorData?.id) {
          const allRecords = await getAllMedicalRecords().catch(() => [])
          data = Array.isArray(allRecords)
            ? allRecords.filter(r => r.doctor?.id === doctorData.id)
            : []
        }
      } else {
        data = await getAllMedicalRecords()
      }
      setRecords(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load records:', err)
      setError('Failed to load medical records. Please try again.')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleCreateOrUpdate = async (recordData) => {
    try {
      if (editingRecord) {
        await updateMedicalRecord(editingRecord.id, recordData)
        toast.success('Record updated successfully!')
      } else {
        await createMedicalRecord(recordData)
        toast.success('Record created successfully!')
      }
      setShowForm(false)
      setEditingRecord(null)
      fetchRecords()
    } catch (err) {
      console.error('Failed to save record:', err)
      toast.error('Failed to save record: ' + (err.message || 'Unknown error'))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    try {
      await deleteMedicalRecord(id)
      toast.success('Record deleted successfully!')
      fetchRecords()
    } catch (err) {
      console.error('Failed to delete record:', err)
      toast.error('Failed to delete record')
    }
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setShowForm(true)
  }

  const filteredRecords = records.filter((record) => {
    const patientName = record.patient?.name || ''
    const doctorName = record.doctor?.name || ''
    const diagnosis = record.diagnosis || ''
    return (
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
        <div className="flex items-center gap-3">
          <button onClick={handleBack}
            style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(19,200,236,0.1)'; e.currentTarget.style.color = '#13c8ec' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}>
            ←
          </button>
          <div>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #13c8ec)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(16,185,129,0.35)', flexShrink: 0 }}><FaFileMedical style={{ color: '#fff', fontSize: '16px' }} /></span>
              Medical Records
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.875rem', marginTop: '2px' }}>Manage and access patient medical records</p>
          </div>
        </div>
        {canAddRecord && (
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', color: '#fff', fontWeight: 700, fontSize: '0.9rem', background: 'linear-gradient(135deg, #10b981, #13c8ec)', boxShadow: '0 4px 20px rgba(16,185,129,0.4)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onClick={() => { setEditingRecord(null); setShowForm(true) }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <FaFileMedicalAlt /> Add Record
          </button>
        )}
      </div>

      {/* Search */}
      <div className="animate-fade-up delay-100" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px 16px', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <FaSearch style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input type="text" placeholder="Search by patient, doctor, or diagnosis..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', width: '100%', outline: 'none', border: 'none', color: '#fff', fontSize: '0.875rem' }} />
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-up delay-200" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem' }}>
        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📋</span>
          Medical Records <span style={{ color: 'rgba(16,185,129,0.7)' }}>({filteredRecords.length})</span>
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div style={{ width: '48px', height: '48px', border: '3px solid rgba(16,185,129,0.15)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading records...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p style={{ color: '#fb7185', marginBottom: '12px' }}>{error}</p>
            <button onClick={fetchRecords} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #10b981, #13c8ec)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12" style={{ border: '2px dashed rgba(255,255,255,0.07)', borderRadius: '16px' }}>
            <FaFileMedical style={{ color: 'rgba(255,255,255,0.08)', fontSize: '3rem', margin: '0 auto 12px', display: 'block' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>No medical records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Patient', 'Doctor', 'Date', 'Diagnosis', 'Prescription', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '0.8rem', flexShrink: 0 }}>{(record.patient?.name || 'P').charAt(0)}</div>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{record.patient?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>{record.doctor?.name || 'N/A'}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>{record.date || 'N/A'}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.diagnosis || 'N/A'}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.prescription || 'N/A'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button title="View" onClick={() => setViewingRecord(record)}
                          style={{ padding: '8px', borderRadius: '10px', background: 'rgba(19,200,236,0.1)', border: '1px solid rgba(19,200,236,0.2)', color: '#13c8ec', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(19,200,236,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(19,200,236,0.1)'}><FaEye /></button>
                        <button title="Edit" onClick={() => handleEdit(record)}
                          style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}><FaEdit /></button>
                        <button title="Delete" onClick={() => handleDelete(record.id)}
                          style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingRecord && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'rgba(10,15,35,0.95)', border: '1px solid rgba(19,200,236,0.2)', borderRadius: '20px', maxWidth: '500px', width: '100%', boxShadow: '0 32px 64px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>Medical Record Details</h2>
              <button onClick={() => setViewingRecord(null)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Patient', value: viewingRecord.patient?.name },
                { label: 'Doctor', value: viewingRecord.doctor?.name },
                { label: 'Date', value: viewingRecord.date },
                { label: 'Diagnosis', value: viewingRecord.diagnosis },
                { label: 'Prescription', value: viewingRecord.prescription },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
                  <p style={{ color: '#fff', fontWeight: 600, marginTop: '4px' }}>{value || 'N/A'}</p>
                </div>
              ))}
              {viewingRecord.reportLink && (
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Report</span>
                  <p><a href={viewingRecord.reportLink} target="_blank" rel="noopener noreferrer" style={{ color: '#13c8ec', textDecoration: 'none' }}>View Report →</a></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <MedicalRecordForm
          record={editingRecord}
          onClose={() => { setShowForm(false); setEditingRecord(null) }}
          onSubmit={handleCreateOrUpdate}
        />
      )}
    </div>
  )
}

export default MedicalRecords