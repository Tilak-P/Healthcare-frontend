import { useState } from 'react'
import toast from 'react-hot-toast'
import {
    FaArrowLeft, FaCheckCircle,
    FaEnvelope, FaLock, FaPhone,
    FaUser, FaUserInjured, FaUserMd, FaUserPlus, FaUserShield
} from 'react-icons/fa'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateRegistrationForm } from '../utils/validators'

const roleConfig = {
    patient: {
        title: 'Patient', icon: FaUserInjured, roleValue: 'PATIENT',
        gradient: 'linear-gradient(135deg, #0ea5e9, #13c8ec, #6366f1)',
        accent: '#13c8ec', glowRgb: '19,200,236',
        orb1: 'rgba(19,200,236,0.18)', orb2: 'rgba(99,102,241,0.14)',
    },
    doctor: {
        title: 'Doctor', icon: FaUserMd, roleValue: 'DOCTOR',
        gradient: 'linear-gradient(135deg, #10b981, #13c8ec, #06b6d4)',
        accent: '#10b981', glowRgb: '16,185,129',
        orb1: 'rgba(16,185,129,0.18)', orb2: 'rgba(6,182,212,0.14)',
    },
    admin: {
        title: 'Administrator', icon: FaUserShield, roleValue: 'ADMIN',
        gradient: 'linear-gradient(135deg, #7c3aed, #a855f7, #13c8ec)',
        accent: '#a855f7', glowRgb: '168,85,247',
        orb1: 'rgba(168,85,247,0.18)', orb2: 'rgba(139,92,246,0.14)',
    },
}

// eslint-disable-next-line no-unused-vars
const InputField = ({ icon: Icon, label, name, type = 'text', value, onChange, placeholder, error, accent = '#13c8ec', glowRgb = '19,200,236' }) => (
    <div className="animate-fade-up">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
                type={type} name={name} value={value} onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all duration-200"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: error ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px rgba(${glowRgb},0.18)` }}
                onBlur={e => { e.target.style.borderColor = error ? '#f43f5e' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
            />
        </div>
        {error && <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1"><FaCheckCircle className="rotate-45" />{error}</p>}
    </div>
)

const Signup = () => {
    const [searchParams] = useSearchParams()
    const role = searchParams.get('role') || 'patient'
    const config = roleConfig[role] || roleConfig.patient
    const IconComponent = config.icon
    const navigate = useNavigate()
    const { register } = useAuth()

    const [formData, setFormData] = useState({
        username: '', email: '', password: '', confirmPassword: '', contactno: '', role: config.roleValue
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' })
            toast.error('Passwords do not match')
            return
        }
        const validation = validateRegistrationForm(formData)
        if (!validation.isValid) { setErrors(validation.errors); return }
        setLoading(true)
        try {
            const result = await register({
                username: formData.username, email: formData.email,
                password: formData.password, contactno: formData.contactno, role: config.roleValue,
            })
            if (result.success) {
                toast.success('Account created! Please sign in. 🎉')
                navigate(`/login?role=${role}`)
            } else {
                toast.error(result.message || 'Signup failed. Please try again.')
            }
        } catch (error) {
            toast.error(error.message || 'Signup failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)' }}>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="animate-float absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl"
                    style={{ background: `radial-gradient(circle, ${config.orb1}, transparent 70%)`, animationDelay: '0s' }} />
                <div className="animate-float absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl"
                    style={{ background: `radial-gradient(circle, ${config.orb2}, transparent 70%)`, animationDelay: '1.5s' }} />
                <div className="absolute inset-0 opacity-[0.035]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                <button onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-all duration-200 hover:-translate-x-1 group animate-slide-right">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to role selection</span>
                </button>

                <div className="rounded-3xl overflow-hidden animate-scale-in"
                    style={{
                        background: 'rgba(8,14,32,0.82)',
                        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                        border: `1px solid rgba(${config.glowRgb},0.2)`,
                        boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.4), 0 0 40px rgba(${config.glowRgb},0.08)`,
                    }}>

                    <div className="h-1" style={{ background: config.gradient }} />

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="animate-pop-in flex justify-center mb-5">
                                <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
                                    style={{ background: config.gradient, boxShadow: `0 16px 40px ${config.accent}50` }}>
                                    <IconComponent className="text-white text-3xl" />
                                    <span className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                                        style={{ background: config.gradient }} />
                                </div>
                            </div>
                            <h1 className="text-3xl font-black text-white animate-fade-up delay-100">
                                Create Account
                            </h1>
                            <p className="text-sm font-bold mt-1 animate-fade-up delay-150"
                                style={{ background: config.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                {config.title} Portal
                            </p>
                            <p className="text-slate-400 text-sm mt-1 animate-fade-up delay-200">
                                Fill in your details to get started
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="delay-200">
                                <InputField icon={FaUser} label="Username" name="username" value={formData.username}
                                    onChange={handleChange} placeholder="Enter your username" error={errors.username}
                                    accent={config.accent} glowRgb={config.glowRgb} />
                            </div>
                            <div className="delay-250">
                                <InputField icon={FaEnvelope} label="Email Address" name="email" type="email" value={formData.email}
                                    onChange={handleChange} placeholder="you@example.com" error={errors.email}
                                    accent={config.accent} glowRgb={config.glowRgb} />
                            </div>
                            <div className="delay-300">
                                <InputField icon={FaPhone} label="Contact Number" name="contactno" type="tel" value={formData.contactno}
                                    onChange={handleChange} placeholder="Enter contact number" error={errors.contactno}
                                    accent={config.accent} glowRgb={config.glowRgb} />
                            </div>
                            <div className="delay-350">
                                <InputField icon={FaLock} label="Password" name="password" type="password" value={formData.password}
                                    onChange={handleChange} placeholder="Create a password" error={errors.password}
                                    accent={config.accent} glowRgb={config.glowRgb} />
                            </div>
                            <div className="delay-400">
                                <InputField icon={FaLock} label="Confirm Password" name="confirmPassword" type="password"
                                    value={formData.confirmPassword} onChange={handleChange}
                                    placeholder="Confirm your password" error={errors.confirmPassword}
                                    accent={config.accent} glowRgb={config.glowRgb} />
                            </div>

                            <button type="submit" disabled={loading}
                                className={`w-full py-4 px-6 rounded-2xl font-black text-white text-sm transition-all duration-300 animate-fade-up delay-500 relative overflow-hidden group mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                style={{ background: config.gradient, boxShadow: `0 8px 32px ${config.accent}40` }}>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Account...</>
                                    ) : (
                                        <><FaUserPlus /> Create Account</>
                                    )}
                                </span>
                                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-500 animate-fade-up delay-600">
                            Already have an account?{' '}
                            <Link to={`/login?role=${role}`}
                                className="font-bold transition-colors"
                                style={{ color: config.accent }}>
                                Sign In →
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
