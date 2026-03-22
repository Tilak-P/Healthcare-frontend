import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const roles = [
    {
        key: 'patient',
        title: 'Patient',
        subtitle: 'Personal Health Portal',
        description: 'Book appointments, view medical records, and manage your complete health journey with ease.',
        icon: '🫀',
        features: ['Book Appointments', 'View Records', 'Prescriptions'],
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #13c8ec 50%, #6366f1 100%)',
        glowColor: '#13c8ec',
        orb1: '#38bdf8',
        orb2: '#818cf8',
        borderGlow: 'rgba(19,200,236,0.4)',
        path: '/login?role=patient',
    },
    {
        key: 'doctor',
        title: 'Doctor',
        subtitle: 'Clinical Dashboard',
        description: 'Manage appointments, access patient records, set your availability, and update medical notes.',
        icon: '🩺',
        features: ['Manage Schedule', 'Patient Records', 'Medical Notes'],
        gradient: 'linear-gradient(135deg, #10b981 0%, #13c8ec 50%, #06b6d4 100%)',
        glowColor: '#10b981',
        orb1: '#34d399',
        orb2: '#22d3ee',
        borderGlow: 'rgba(16,185,129,0.4)',
        path: '/login?role=doctor',
    },
    {
        key: 'admin',
        title: 'Admin',
        subtitle: 'System Control Center',
        description: 'Full system access to manage users, generate reports, and oversee hospital operations.',
        icon: '🛡️',
        features: ['Manage Doctors', 'System Reports', 'Hospital Stats'],
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #13c8ec 100%)',
        glowColor: '#a855f7',
        orb1: '#a78bfa',
        orb2: '#c084fc',
        borderGlow: 'rgba(168,85,247,0.4)',
        path: '/login?role=admin',
    },
]

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 2 + (i % 3),
    top: `${(i * 17 + 5) % 100}%`,
    left: `${(i * 23 + 8) % 100}%`,
    color: ['#13c8ec', '#34d399', '#a78bfa', '#60a5fa', '#f59e0b'][i % 5],
    duration: 3 + (i % 4),
    delay: i * 0.35,
}))

const Card3D = ({ role, index, navigate }) => {
    const cardRef = useRef(null)
    const [rotate, setRotate] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
        const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
        setRotate({ x: -dy * 12, y: dx * 12 })
    }

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 })
        setIsHovered(false)
    }

    return (
        <div
            style={{
                perspective: '1000px',
                animation: `fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) ${index * 160}ms both`,
            }}
        >
            <div
                style={{
                    position: 'relative',
                    borderRadius: '24px',
                    padding: '1px',
                    background: isHovered
                        ? `linear-gradient(135deg, ${role.glowColor}80, transparent 60%, ${role.orb2}50)`
                        : 'linear-gradient(135deg, rgba(255,255,255,0.06), transparent)',
                    transition: 'background 0.4s ease',
                    boxShadow: isHovered ? `0 0 40px ${role.glowColor}30` : 'none',
                }}
            >
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate(role.path)}
                    style={{
                        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isHovered ? 'scale(1.03)' : 'scale(1)'}`,
                        transition: isHovered ? 'transform 0.1s linear' : 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
                        transformStyle: 'preserve-3d',
                        cursor: 'pointer',
                        willChange: 'transform',
                        background: 'rgba(10, 15, 35, 0.80)',
                        backdropFilter: 'blur(28px)',
                        WebkitBackdropFilter: 'blur(28px)',
                        borderRadius: '23px',
                        padding: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '23px',
                        background: `linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.06) 50%, transparent 80%)`,
                        transform: isHovered ? 'translateX(110%)' : 'translateX(-110%)',
                        transition: 'transform 0.7s ease',
                    }} />

                    {/* Top gradient bar */}
                    <div style={{
                        height: '3px', borderRadius: '99px', marginBottom: '1rem',
                        background: role.gradient,
                        boxShadow: isHovered ? `0 0 16px ${role.glowColor}80` : 'none',
                        transition: 'box-shadow 0.4s',
                    }} />

                    {/* Icon badge */}
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: role.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', marginBottom: '1rem', position: 'relative',
                        boxShadow: isHovered ? `0 12px 36px ${role.glowColor}60` : `0 6px 18px ${role.glowColor}30`,
                        transform: `translateZ(${isHovered ? 24 : 0}px)`,
                        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                    }}>
                        {role.icon}
                        {/* Icon inner shine */}
                        <div style={{
                            position: 'absolute', inset: 0, borderRadius: '18px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
                        }} />
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '2px',
                        transform: `translateZ(${isHovered ? 8 : 0}px)`, transition: 'transform 0.4s',
                    }}>{role.title}</h2>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
                        textTransform: 'uppercase', marginBottom: '0.5rem',
                        background: role.gradient,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>{role.subtitle}</p>

                    {/* Description */}
                    <p style={{
                        fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1rem',
                        color: 'rgba(255,255,255,0.5)',
                    }}>{role.description}</p>

                    {/* Feature chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                        {role.features.map(f => (
                            <span key={f} style={{
                                fontSize: '0.65rem', fontWeight: 600, padding: '4px 10px', borderRadius: '99px',
                                background: `${role.glowColor}18`,
                                color: role.orb1,
                                border: `1px solid ${role.glowColor}35`,
                            }}>{f}</span>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <button
                        style={{
                            width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                            fontWeight: 900, fontSize: '0.875rem', color: '#fff', cursor: 'pointer',
                            background: role.gradient, position: 'relative', overflow: 'hidden',
                            boxShadow: isHovered ? `0 8px 32px ${role.glowColor}60` : `0 4px 16px ${role.glowColor}30`,
                            transition: 'box-shadow 0.3s',
                        }}
                    >
                        <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            Continue as {role.title}
                            <span style={{
                                display: 'inline-block',
                                transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                                transition: 'transform 0.3s',
                            }}>→</span>
                        </span>
                        <span style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(255,255,255,0.12)',
                            opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s',
                        }} />
                    </button>
                </div>
            </div>
        </div>
    )
}

const MedicalCrossLogo = () => (
    <div style={{ position: 'relative', width: '44px', height: '44px' }}>
        <div style={{
            position: 'absolute', inset: '-6px', borderRadius: '14px',
            background: 'transparent',
            border: '2px solid rgba(19,200,236,0.5)',
            animation: 'stitchPulse 2s ease-in-out infinite',
        }} />
        <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #0ea5e9, #13c8ec)',
            boxShadow: '0 4px 20px rgba(19,200,236,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1,
        }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="8" y="1" width="6" height="20" rx="2" fill="white" />
                <rect x="1" y="8" width="20" height="6" rx="2" fill="white" />
            </svg>
        </div>
    </div>
)

const RoleSelect = () => {
    const navigate = useNavigate()
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }

    return (
        <div
            style={{
                minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #060b18 0%, #0a1628 35%, #071420 65%, #080e1c 100%)',
            }}
            onMouseMove={handleMouseMove}
        >
            {/* ── CSS Keyframes injected ── */}
            <style>{`
                @keyframes stitchPulse {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50%       { transform: scale(1.15); opacity: 0.2; }
                }
                @keyframes stitchOrb {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%       { transform: translate(30px, -20px) scale(1.05); }
                    66%       { transform: translate(-20px, 15px) scale(0.97); }
                }
                @keyframes stitchParticle {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
                    50%       { transform: translateY(-12px) scale(1.2); opacity: 0.9; }
                }
                @keyframes stitchUnderline {
                    0%   { width: 0%; left: 50%; }
                    50%  { width: 80%; left: 10%; }
                    100% { width: 60%; left: 20%; }
                }
                @keyframes stitchGradShift {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes stitchBadgePing {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%       { transform: scale(1.4); opacity: 0; }
                }
            `}</style>

            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', width: 700, height: 700,
                    top: '-20%', left: '-15%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(19,200,236,0.18), transparent 65%)',
                    filter: 'blur(60px)',
                    transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -25}px)`,
                    transition: 'transform 1s ease',
                    animation: 'stitchOrb 12s ease-in-out infinite',
                }} />
                {/* Orb 2 – right teal */}
                <div style={{
                    position: 'absolute', width: 600, height: 600,
                    top: '25%', right: '-12%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.14), transparent 65%)',
                    filter: 'blur(60px)',
                    transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 25}px)`,
                    transition: 'transform 0.9s ease',
                    animation: 'stitchOrb 15s ease-in-out infinite reverse',
                }} />
                {/* Orb 3 – bottom purple */}
                <div style={{
                    position: 'absolute', width: 400, height: 400,
                    bottom: '5%', left: '25%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.16), transparent 65%)',
                    filter: 'blur(50px)',
                    transform: `translate(${mousePos.x * -20}px, ${mousePos.y * 15}px)`,
                    transition: 'transform 1.2s ease',
                }} />

                {/* Subtle grid */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.03,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                    backgroundSize: '52px 52px',
                }} />

                {/* Floating particles */}
                {PARTICLES.map(p => (
                    <div key={p.id} style={{
                        position: 'absolute',
                        width: p.size, height: p.size, borderRadius: '50%',
                        top: p.top, left: p.left,
                        background: p.color,
                        opacity: 0.55,
                        animation: `stitchParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                    }} />
                ))}
            </div>

            {/* ── Header ── */}
            <header style={{
                position: 'relative', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 2rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                animation: 'slideRight 0.6s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <MedicalCrossLogo />
                    <div>
                        <p style={{ color: '#fff', fontWeight: 900, fontSize: '1.05rem', lineHeight: 1.1 }}>HealthCare Pro</p>
                        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.7rem', fontWeight: 500 }}>Medical Management System</p>
                    </div>
                </div>

                {/* Stitch-style live badge */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 14px', borderRadius: '99px',
                    background: 'rgba(19,200,236,0.08)',
                    border: '1px solid rgba(19,200,236,0.2)',
                }}>
                    <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: '#13c8ec',
                        animation: 'stitchBadgePing 1.8s ease-in-out infinite',
                        display: 'inline-block',
                    }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#13c8ec', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Live System
                    </span>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main style={{
                position: 'relative', zIndex: 10,
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '1rem 1.5rem',
            }}>
                {/* Heading */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {/* Platform badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '4px 16px', borderRadius: '99px', marginBottom: '1rem',
                        background: 'rgba(99,102,241,0.12)',
                        border: '1px solid rgba(99,102,241,0.22)',
                        animation: 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
                    }}>
                        <span style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: '#a78bfa', display: 'inline-block',
                            animation: 'stitchBadgePing 2s ease-in-out infinite',
                        }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            Healthcare Management Platform
                        </span>
                    </div>

                    {/* Main heading */}
                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                        fontWeight: 900, color: '#fff',
                        lineHeight: 1.15, marginBottom: '0.35rem',
                        animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 80ms both',
                    }}>
                        Welcome —{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #13c8ec 0%, #a78bfa 50%, #34d399 100%)',
                            backgroundSize: '200% 200%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'stitchGradShift 5s ease infinite',
                        }}>
                            Who are you?
                        </span>
                    </h1>

                    {/* Animated underline */}
                    <div style={{ position: 'relative', height: '3px', maxWidth: '320px', margin: '0.5rem auto 0' }}>
                        <div style={{
                            position: 'absolute', height: '3px', borderRadius: '99px',
                            background: 'linear-gradient(90deg, #13c8ec, #a78bfa)',
                            animation: 'stitchUnderline 3s ease-in-out infinite',
                        }} />
                    </div>

                    <p style={{
                        marginTop: '1rem', fontSize: '1.05rem', fontWeight: 500,
                        color: 'rgba(255,255,255,0.45)',
                        animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 160ms both',
                    }}>
                        Select your role to access the system
                    </p>
                </div>

                {/* Role Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    width: '100%',
                    maxWidth: '1100px',
                }}>
                    {roles.map((role, i) => (
                        <Card3D key={role.key} role={role} index={i} navigate={navigate} />
                    ))}
                </div>

                {/* Footer note */}
                <p style={{
                    marginTop: '1.5rem', fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.2)',
                    animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 700ms both',
                    letterSpacing: '0.05em',
                }}>
                    🔒 Secure &nbsp;•&nbsp; HIPAA Compliant &nbsp;•&nbsp; 24/7 Support
                </p>
            </main>
        </div>
    )
}

export default RoleSelect
