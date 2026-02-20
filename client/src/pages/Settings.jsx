import { useState } from 'react';
import { Shield, Lock, Bell, ChevronRight, User, Fingerprint } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import useMobile from '../hooks/useMobile';

const Settings = () => {
    const isMobile = useMobile();
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handleUpdatePin = async (e) => {
        e.preventDefault();
        if (newPin.length !== 4) {
            return toast.error('PIN must be 4 digits');
        }
        if (newPin !== confirmPin) {
            return toast.error('PINs do not match');
        }

        try {
            await api.put('/auth/update-pin', { newPin });
            toast.success('PIN updated successfully');
            setNewPin('');
            setConfirmPin('');
        } catch (err) {
            toast.error('Failed to update PIN');
        }
    };

    const SettingItem = ({ icon: Icon, title, subtitle, action, danger }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            marginBottom: '1rem',
            transition: 'all 0.2s ease',
            cursor: action ? 'pointer' : 'default'
        }} className="setting-item-hover">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(194, 24, 91, 0.1)',
                    color: danger ? 'var(--error)' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={24} />
                </div>
                <div>
                    <p style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1rem' }}>{title}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{subtitle}</p>
                </div>
            </div>
            {action ? action : <ChevronRight size={20} color="var(--text-muted)" />}
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Settings</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Customize your workspace and security</p>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'start'
            }}>
                {/* Profile & General Section */}

                {/* Security Section */}
                <section style={{ width: '100%', maxWidth: '600px' }}>
                    <div className="card" style={{ padding: '2.5rem', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Update Entry PIN</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Change your 4-digit access code</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdatePin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>New PIN</label>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="Enter 4 digits"
                                    value={newPin}
                                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                                    style={{
                                        padding: '1rem',
                                        fontSize: '1.25rem',
                                        textAlign: 'center',
                                        borderRadius: '12px',
                                        border: '2px solid var(--border)',
                                        backgroundColor: 'var(--bg-card)',
                                        color: 'var(--text-main)'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>Confirm PIN</label>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="Confirm digits"
                                    value={confirmPin}
                                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                                    style={{
                                        padding: '1rem',
                                        fontSize: '1.25rem',
                                        textAlign: 'center',
                                        borderRadius: '12px',
                                        border: '2px solid var(--border)',
                                        backgroundColor: 'var(--bg-card)',
                                        color: 'var(--text-main)'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{
                                    marginTop: '1rem',
                                    height: '56px',
                                    borderRadius: '16px',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 8px 20px rgba(217, 70, 239, 0.35)'
                                }}
                            >
                                Secure Update
                            </button>
                        </form>
                    </div>
                </section>
            </div>

            <style>{`
                .setting-item-hover:hover {
                    transform: translateY(-2px);
                    border-color: var(--primary);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
            `}</style>
        </div>
    );
};

export default Settings;
