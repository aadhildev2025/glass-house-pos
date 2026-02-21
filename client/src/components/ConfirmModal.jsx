import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", type = "danger" }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '1rem'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="card glass"
                        style={{
                            width: '400px',
                            maxWidth: '100%',
                            padding: '2rem',
                            textAlign: 'center',
                            boxShadow: '0 25px 50px -12px rgba(217, 70, 239, 0.4)',
                            border: '1px solid var(--primary-light)'
                        }}
                    >
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            backgroundColor: type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(217, 70, 239, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: type === 'danger' ? 'var(--error)' : 'var(--primary)'
                        }}>
                            <AlertTriangle size={32} />
                        </div>

                        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>{title}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
                            {message}
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1, padding: '0.875rem',
                                    backgroundColor: 'var(--bg-accent)',
                                    color: 'var(--text-main)',
                                    fontWeight: '600'
                                }}
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={type === 'danger' ? '' : 'btn-primary'}
                                style={{
                                    flex: 1, padding: '0.875rem',
                                    backgroundColor: type === 'danger' ? 'var(--error)' : undefined,
                                    color: 'white',
                                    fontWeight: '600',
                                    boxShadow: type === 'danger' ? '0 4px 14px 0 rgba(239, 68, 68, 0.3)' : undefined
                                }}
                            >
                                {confirmText}
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'none', color: 'var(--text-muted)', padding: '0.5rem'
                            }}
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
