import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const SplashScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)', // Light theme cohesive background
                overflow: 'hidden'
            }}
        >
            {/* Ambient Background Circles */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(217, 70, 239, 0.15) 0%, transparent 70%)',
                    zIndex: -1
                }}
            />

            <div style={{ textAlign: 'center' }}>
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 1,
                        ease: [0, 0.71, 0.2, 1.01],
                        scale: {
                            type: "spring",
                            damping: 12,
                            stiffness: 100,
                            restDelta: 0.001
                        }
                    }}
                >
                    <div style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: 'white',
                        borderRadius: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 20px 40px rgba(217, 70, 239, 0.15)',
                        border: '1px solid rgba(217, 70, 239, 0.1)'
                    }}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                width: '80px',
                                height: 'auto',
                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))'
                            }}
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em',
                        marginBottom: '0.5rem'
                    }}>
                        Glass House
                    </h1>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                    }}>
                        Point of Sale
                    </p>
                </motion.div>

                {/* Loading bar */}
                <div style={{
                    width: '160px',
                    height: '4px',
                    backgroundColor: 'rgba(217, 70, 239, 0.1)',
                    borderRadius: '2px',
                    margin: '2rem auto 0',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, #d946ef, transparent)',
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default SplashScreen;
