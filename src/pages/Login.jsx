import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaEnvelope, FaLock, FaSignInAlt, FaUserInjured, FaUserMd, FaUserShield } from 'react-icons/fa'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateLoginForm } from '../utils/validators'

const roleConfig = {
  patient: {
    title: 'Patient',
    icon: FaUserInjured,
    gradient: 'from-sky-400 via-cyan-400 to-indigo-500',
    glow: 'shadow-cyan-500/50',
    accent: '#13c8ec',
    glowRgb: '19,200,236',
    bgGradient: 'from-sky-500 to-cyan-600',
    dashboard: '/patient-dashboard'
  },
  doctor: {
    title: 'Doctor',
    icon: FaUserMd,
    gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
    glow: 'shadow-emerald-500/50',
    accent: '#10b981',
    glowRgb: '16,185,129',
    bgGradient: 'from-emerald-500 to-teal-600',
    dashboard: '/doctor-dashboard'
  },
  admin: {
    title: 'Administrator',
    icon: FaUserShield,
    gradient: 'from-violet-500 via-purple-500 to-indigo-600',
    glow: 'shadow-violet-500/50',
    accent: '#a855f7',
    glowRgb: '168,85,247',
    bgGradient: 'from-violet-600 to-indigo-700',
    dashboard: '/admin-dashboard'
  }
}

const Login = ({ onLogin }) => {
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role') || 'patient'
  const config = roleConfig[role] || roleConfig.patient
  const IconComponent = config.icon
  const navigate = useNavigate()
  const { login, logout } = useAuth()

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const validation = validateLoginForm(formData)
      if (!validation.isValid) { setErrors(validation.errors); setLoading(false); return }
      const result = await login({ email: formData.email, password: formData.password })
      if (result.success) {
        const expectedRole = role.toUpperCase()
        const actualRole = result.user?.role
        if (actualRole !== expectedRole) {
          logout()
          toast.error(`This account is registered as ${actualRole}. Please use the ${actualRole.toLowerCase()} login.`)
          setLoading(false)
          return
        }
        toast.success('Welcome back! 🎉')
        if (onLogin) onLogin()
        const dashboardMap = { ADMIN: '/admin-dashboard', DOCTOR: '/doctor-dashboard', PATIENT: '/patient-dashboard' }
        navigate(dashboardMap[actualRole] || config.dashboard)
      } else {
        toast.error(result.message || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      toast.error(error.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #060b18 0%, #0a1628 40%, #071420 70%, #080e1c 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-18 blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(${config.glowRgb},0.22), transparent 70%)`, animationDelay: '0s' }} />
        <div className="animate-float absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-12 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)', animationDelay: '1.5s' }} />
        <div className="animate-float absolute top-3/4 left-1/2 w-56 h-56 rounded-full opacity-10 blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)', animationDelay: '0.8s' }} />
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
        
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: 2 + (i % 3), height: 2 + (i % 3),
            top: `${(i * 19 + 7) % 100}%`, left: `${(i * 27 + 5) % 100}%`,
            background: [config.accent, '#a78bfa', '#34d399', '#60a5fa'][i % 4],
            opacity: 0.5, animation: `float ${3 + i % 3}s ease-in-out ${i * 0.4}s infinite`,
            boxShadow: `0 0 6px ${[config.accent, '#a78bfa', '#34d399'][i % 3]}`,
          }} />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <button onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-all duration-200 hover:-translate-x-1 group animate-slide-right">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to role selection</span>
        </button>

        {/* Main card */}
        <div className="animate-scale-in" style={{
          background: 'rgba(8,14,32,0.82)',
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          border: `1px solid rgba(${config.glowRgb},0.2)`,
          borderRadius: '24px',
          boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.4), 0 0 40px rgba(${config.glowRgb},0.08)`,
        }}>
          <div className="p-8">

            {/* Header */}
            <div className="text-center mb-8">
              {/* Animated icon */}
              <div className="animate-pop-in flex justify-center mb-5">
                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-2xl ${config.glow}`}>
                  <IconComponent className="text-white text-3xl" />
                  {/* Pulse ring */}
                  <span className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                    style={{ background: `linear-gradient(135deg, ${config.accent}, #6366f1)` }} />
                </div>
              </div>

              <h1 className="text-3xl font-black text-white animate-fade-up delay-100">
                {config.title} <span className="gradient-text">Login</span>
              </h1>
              <p className="text-slate-400 mt-2 text-sm animate-fade-up delay-150">
                Sign in to access your {config.title.toLowerCase()} portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="animate-fade-up delay-200">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    required placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all duration-200`}
                    style={{ background: 'rgba(255,255,255,0.05)', border: errors.email ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => { e.target.style.borderColor = config.accent; e.target.style.boxShadow = `0 0 0 3px rgba(${config.glowRgb},0.18)` }}
                    onBlur={e => { e.target.style.borderColor = errors.email ? '#f43f5e' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-xs mt-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="animate-fade-up delay-250">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    type="password" name="password" value={formData.password} onChange={handleChange}
                    required placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all duration-200`}
                    style={{ background: 'rgba(255,255,255,0.05)', border: errors.password ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => { e.target.style.borderColor = config.accent; e.target.style.boxShadow = `0 0 0 3px rgba(${config.glowRgb},0.18)` }}
                    onBlur={e => { e.target.style.borderColor = errors.password ? '#f43f5e' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                {errors.password && <p className="text-rose-400 text-xs mt-1.5">{errors.password}</p>}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between animate-fade-up delay-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}
                    className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white text-sm transition-all duration-300 animate-fade-up delay-350 relative overflow-hidden group ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                style={{ background: `linear-gradient(135deg, ${config.accent}, #6366f1)`, boxShadow: `0 8px 32px rgba(${config.glowRgb},0.45)`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = `0 12px 40px rgba(${config.glowRgb},0.65)`)}
                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 8px 32px rgba(${config.glowRgb},0.45)`}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                  ) : (
                    <><FaSignInAlt /> Sign In</>
                  )}
                </span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500 animate-fade-up delay-500">
              Don't have an account?{' '}
              <Link to={`/signup?role=${role}`} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign Up →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login