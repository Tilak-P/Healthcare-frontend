import { useState } from 'react'
import { FaEdit, FaEye, FaFilter, FaSearch, FaTrash, FaUserInjured, FaUserPlus } from 'react-icons/fa'

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const patients = [
    { id: 1, name: 'John Doe', age: 35, gender: 'Male', lastVisit: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', age: 28, gender: 'Female', lastVisit: '2024-01-10', status: 'Active' },
    { id: 3, name: 'Robert Brown', age: 45, gender: 'Male', lastVisit: '2024-01-05', status: 'Inactive' },
    { id: 4, name: 'Sarah Wilson', age: 32, gender: 'Female', lastVisit: '2024-01-18', status: 'Active' },
    { id: 5, name: 'Mike Johnson', age: 50, gender: 'Male', lastVisit: '2023-12-20', status: 'Inactive' },
  ]

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus
    return matchesSearch && matchesStatus
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
              <span style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(14,165,233,0.4)', flexShrink: 0 }}>
                <FaUserInjured style={{ color: '#fff', fontSize: '16px' }} />
              </span>
              Patients
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.875rem', marginTop: '2px' }}>Manage patient records and information</p>
          </div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', color: '#fff', fontWeight: 700, fontSize: '0.9rem', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 4px 20px rgba(14,165,233,0.4)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <FaUserPlus /> Add Patient
        </button>
      </div>

      {/* Search / Filter */}
      <div className="animate-fade-up delay-100" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px 20px' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px 16px', flex: 1, maxWidth: '400px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <FaSearch style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input type="text" placeholder="Search patients..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', width: '100%', outline: 'none', border: 'none', color: '#fff', fontSize: '0.875rem' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 16px', color: '#fff', fontSize: '0.875rem', outline: 'none', cursor: 'pointer' }}>
              <option value="all" style={{ background: '#0a1628' }}>All Status</option>
              <option value="Active" style={{ background: '#0a1628' }}>Active</option>
              <option value="Inactive" style={{ background: '#0a1628' }}>Inactive</option>
            </select>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              <FaFilter /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-up delay-200" style={{ background: 'rgba(10,15,35,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem' }}>
        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏥</span>
          Patient List <span style={{ color: 'rgba(14,165,233,0.7)' }}>({filteredPatients.length})</span>
        </h2>

        {filteredPatients.length === 0 ? (
          <div className="text-center py-12" style={{ border: '2px dashed rgba(255,255,255,0.07)', borderRadius: '16px' }}>
            <FaUserInjured style={{ color: 'rgba(255,255,255,0.08)', fontSize: '3rem', margin: '0 auto 12px', display: 'block' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>No patients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Name', 'Age', 'Gender', 'Last Visit', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '0.875rem', flexShrink: 0 }}>
                          {patient.name.charAt(0)}
                        </div>
                        <span style={{ color: '#fff', fontWeight: 700 }}>{patient.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>{patient.age}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>{patient.gender}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>{patient.lastVisit}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '5px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                        background: patient.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                        color: patient.status === 'Active' ? '#34d399' : 'rgba(255,255,255,0.4)',
                        border: patient.status === 'Active' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.1)',
                      }}>
                        {patient.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={{ padding: '8px', borderRadius: '10px', background: 'rgba(19,200,236,0.1)', border: '1px solid rgba(19,200,236,0.2)', color: '#13c8ec', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(19,200,236,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(19,200,236,0.1)'}><FaEye /></button>
                        <button style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}><FaEdit /></button>
                        <button style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', cursor: 'pointer', transition: 'background 0.15s' }}
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
    </div>
  )

}

export default Patients