import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Lock, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = () => {
    const [pin, setPin] = useState('');
    const { login } = useContext(AuthContext);

    const handleNumberClick = (num) => {
        if (pin.length < 4) {
            setPin(prev => prev + num.toString());
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const handleSubmit = async () => {
        if (pin.length !== 4) return;
        try {
            const { data } = await api.post('/auth/login', { pin });
            login(data);
            toast.success('Login Successful');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            setPin('');
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key >= '0' && e.key <= '9') {
                handleNumberClick(e.key);
            } else if (e.key === 'Backspace') {
                handleDelete();
            } else if (e.key === 'Escape') {
                setPin('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pin]);

    useEffect(() => {
        if (pin.length === 4) {
            handleSubmit();
        }
    }, [pin]);

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Geometric Pattern Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    linear-gradient(30deg, transparent 40%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, transparent 60%),
                    linear-gradient(60deg, transparent 40%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, transparent 60%),
                    linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, transparent 60%)
                `,
                backgroundSize: '100px 100px',
                opacity: 0.3
            }} />

            {/* Animated Background Shapes */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                animation: 'float 8s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-15%',
                left: '-10%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                animation: 'float 10s ease-in-out infinite reverse'
            }} />

            {/* Main Container - Responsive */}
            <div className="login-container" style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem 1.5rem',
                position: 'relative',
                zIndex: 1,
                gap: '2rem'
            }}>
                {/* Branding Section */}
                <div style={{
                    textAlign: 'center',
                    color: 'white',
                    maxWidth: '500px',
                    animation: 'fadeIn 0.8s ease-out'
                }}>
                    {/* Premium Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        marginBottom: '1.5rem',
                        padding: '0.625rem 1.5rem',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '50px',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em'
                    }}>
                        <Sparkles size={16} />
                        <span className="badge-text">PREMIUM POS</span>
                    </div>

                    {/* Logo */}
                    <img src={logo} alt="Glass House" className="login-logo" style={{
                        width: '140px',
                        height: 'auto',
                        marginBottom: '1.5rem',
                        filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.3))',
                        animation: 'fadeIn 0.8s ease-out 0.2s backwards'
                    }} />

                    {/* Title */}
                    <h1 className="login-title" style={{
                        fontSize: '2.5rem',
                        fontWeight: '900',
                        marginBottom: '0.75rem',
                        letterSpacing: '-0.02em',
                        textShadow: '0 4px 24px rgba(0,0,0,0.25)',
                        animation: 'fadeIn 0.8s ease-out 0.4s backwards'
                    }}>
                        GLASS HOUSE
                    </h1>

                    <p className="login-subtitle" style={{
                        fontSize: '1rem',
                        opacity: 0.95,
                        fontWeight: '400',
                        letterSpacing: '0.02em',
                        marginBottom: '0.5rem',
                        animation: 'fadeIn 0.8s ease-out 0.6s backwards'
                    }}>
                        Next-Generation Retail Management
                    </p>
                </div>

                {/* Login Card */}
                <div className="login-card" style={{
                    width: '100%',
                    maxWidth: '450px',
                    background: 'rgba(255, 255, 255, 0.98)',
                    borderRadius: '28px',
                    padding: '2.5rem 2rem',
                    boxShadow: '0 40px 80px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(20px)',
                    animation: 'slideUp 0.8s ease-out 0.4s backwards'
                }}>
                    {/* Lock Icon */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 12px 32px rgba(217, 70, 239, 0.5)',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}>
                            <Lock size={32} color="white" strokeWidth={2.5} />
                        </div>
                    </div>

                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '1.75rem',
                        fontWeight: '800',
                        color: '#1f2937',
                        marginBottom: '0.5rem'
                    }}>
                        Welcome Back
                    </h2>

                    <p style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        marginBottom: '2.5rem',
                        fontSize: '0.95rem'
                    }}>
                        Enter your secure 4-digit PIN
                    </p>

                    {/* PIN Dots */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1.25rem',
                        marginBottom: '2.5rem'
                    }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: pin.length > i
                                    ? 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)'
                                    : '#e9d5ff',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: pin.length > i ? 'scale(1.2)' : 'scale(1)',
                                boxShadow: pin.length > i
                                    ? '0 6px 16px rgba(217, 70, 239, 0.5)'
                                    : 'none'
                            }} />
                        ))}
                    </div>

                    {/* Number Pad */}
                    <div className="number-pad" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.875rem'
                    }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleNumberClick(num)}
                                className="pin-button"
                                style={{
                                    height: '64px',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#1f2937',
                                    background: 'white',
                                    border: '2px solid #f3e8ff',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 2px 8px rgba(217, 70, 239, 0.08)'
                                }}
                            >
                                {num}
                            </button>
                        ))}

                        <button
                            onClick={() => setPin('')}
                            className="pin-button clear-btn"
                            style={{
                                height: '64px',
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                color: '#ef4444',
                                background: 'white',
                                border: '2px solid #fee2e2',
                                borderRadius: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
                            }}
                        >
                            C
                        </button>

                        <button
                            onClick={() => handleNumberClick(0)}
                            className="pin-button"
                            style={{
                                height: '64px',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                color: '#1f2937',
                                background: 'white',
                                border: '2px solid #f3e8ff',
                                borderRadius: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 2px 8px rgba(217, 70, 239, 0.08)'
                            }}
                        >
                            0
                        </button>

                        <button
                            onClick={handleDelete}
                            className="pin-button delete-btn"
                            style={{
                                height: '64px',
                                fontSize: '1.375rem',
                                fontWeight: '700',
                                color: '#6b7280',
                                background: 'white',
                                border: '2px solid #f3e8ff',
                                borderRadius: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 2px 8px rgba(217, 70, 239, 0.08)'
                            }}
                        >
                            ←
                        </button>
                    </div>

                    {/* Footer */}
                    <div style={{
                        marginTop: '2rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid #f3e8ff',
                        textAlign: 'center',
                        color: '#9ca3af',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                    }}>
                        🔒 256-bit Encryption • Secure Access
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(5deg); }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                .pin-button:hover {
                    background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%) !important;
                    color: white !important;
                    border-color: transparent !important;
                    transform: translateY(-3px);
                    box-shadow: 0 12px 24px rgba(217, 70, 239, 0.4) !important;
                }

                .pin-button:active {
                    transform: translateY(0) scale(0.96);
                }

                .clear-btn:hover {
                    background: #ef4444 !important;
                    color: white !important;
                    border-color: transparent !important;
                    box-shadow: 0 12px 24px rgba(239, 68, 68, 0.35) !important;
                }

                .delete-btn:hover {
                    background: #6b7280 !important;
                    color: white !important;
                    border-color: transparent !important;
                    box-shadow: 0 12px 24px rgba(107, 114, 128, 0.35) !important;
                }

                /* Mobile Optimizations */
                @media (max-width: 640px) {
                    .login-container {
                        padding: 1.5rem 1rem !important;
                        gap: 1.5rem !important;
                    }

                    .badge-text {
                        font-size: 0.7rem !important;
                    }

                    .login-logo {
                        width: 100px !important;
                        margin-bottom: 1rem !important;
                    }

                    .login-title {
                        font-size: 2rem !important;
                        margin-bottom: 0.5rem !important;
                    }

                    .login-subtitle {
                        font-size: 0.875rem !important;
                    }

                    .login-card {
                        padding: 2rem 1.5rem !important;
                        border-radius: 24px !important;
                    }

                    .number-pad {
                        gap: 0.75rem !important;
                    }

                    .pin-button {
                        height: 56px !important;
                        font-size: 1.375rem !important;
                    }

                    .clear-btn, .delete-btn {
                        font-size: 1rem !important;
                    }
                }

                @media (max-width: 400px) {
                    .login-card {
                        padding: 1.75rem 1.25rem !important;
                    }

                    .number-pad {
                        gap: 0.625rem !important;
                    }

                    .pin-button {
                        height: 52px !important;
                        font-size: 1.25rem !important;
                    }
                }

                /* Desktop - Split Screen */
                @media (min-width: 1024px) {
                    .login-container {
                        flex-direction: row !important;
                        padding: 3rem !important;
                        gap: 4rem !important;
                    }

                    .login-logo {
                        width: 180px !important;
                        margin-bottom: 2rem !important;
                    }

                    .login-title {
                        font-size: 3.5rem !important;
                    }

                    .login-subtitle {
                        font-size: 1.25rem !important;
                        margin-bottom: 2rem !important;
                    }

                    .login-card {
                        padding: 3.5rem 3rem !important;
                    }

                    .number-pad {
                        gap: 1rem !important;
                    }

                    .pin-button {
                        height: 70px !important;
                        font-size: 1.625rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
