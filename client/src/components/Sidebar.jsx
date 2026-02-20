import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Package,
    Store,
    Warehouse,
    ShoppingCart,
    Settings,
    History,
    LogOut
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

import useMobile from '../hooks/useMobile';
import logo from '../assets/logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { logout } = useContext(AuthContext);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMobile();

    const menuItems = [
        { icon: ShoppingCart, label: 'POS', path: '/' },
        { icon: Package, label: 'Products', path: '/products' },
        { icon: Warehouse, label: 'Store', path: '/inventory' },
        { icon: History, label: 'History', path: '/history' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleLogoutConfirm = () => {
        setShowLogoutConfirm(!showLogoutConfirm);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1050,
                        backdropFilter: 'blur(4px)'
                    }}
                />
            )}

            <div style={{
                width: 'var(--sidebar-width)',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                position: 'fixed',
                left: isMobile ? (isOpen ? '0' : 'calc(-1 * var(--sidebar-width))') : '0',
                transition: 'left 0.3s ease',
                zIndex: 1100,
                background: 'linear-gradient(180deg, #d946ef 0%, #a855f7 50%, #7c3aed 100%)',
                boxShadow: '4px 0 24px rgba(217, 70, 239, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
                    <img src={logo} alt="Glass House" style={{
                        width: '50px',
                        height: 'auto',
                        objectFit: 'contain'
                    }} />
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        letterSpacing: '0.05em',
                        color: '#ffffff',
                        textTransform: 'uppercase'
                    }}>
                        Glass House
                    </h2>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => isMobile && setIsOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.875rem 1rem',
                                textDecoration: 'none',
                                color: location.pathname === item.path ? '#fff' : 'rgba(255, 255, 255, 0.75)',
                                backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                                borderRadius: 'var(--radius)',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                borderLeft: location.pathname === item.path ? '3px solid #fff' : '3px solid transparent'
                            }}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={toggleLogoutConfirm}
                        className="sidebar-logout-btn"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            textAlign: 'left',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            fontWeight: '600'
                        }}
                    >
                        <LogOut size={20} style={{ color: '#ff4d4d' }} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(8px)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div className="animate-fade-in" style={{
                        background: 'var(--bg-card)',
                        padding: '2rem',
                        borderRadius: '24px',
                        width: '90%',
                        maxWidth: '400px',
                        textAlign: 'center',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: 'var(--error)'
                        }}>
                            <LogOut size={32} />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Logout Confirmation</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Are you sure you want to sign out of your account?
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={toggleLogoutConfirm}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: '2px solid var(--border)',
                                    background: 'transparent',
                                    color: 'var(--text-main)',
                                    fontWeight: '600'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'var(--error)',
                                    color: 'white',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
