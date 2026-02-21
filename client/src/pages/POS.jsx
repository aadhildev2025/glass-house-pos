import { useState, useEffect, useContext } from 'react';
import {
    Plus,
    Minus,
    Trash2,
    Search,
    ShoppingCart,
    Printer,
    CreditCard,
    Banknote,
    ChevronRight,
    Package
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';

import useMobile from '../hooks/useMobile';

const POS = () => {
    const [products, setProducts] = useState([]);
    const [store, setStore] = useState({});
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [discount, setDiscount] = useState(0);
    const isMobile = useMobile();
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, storeRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/store')
                ]);
                setProducts(prodRes.data);
                setStore(storeRes.data);
            } catch (err) {
                toast.error('Failed to load POS data');
            }
        };
        fetchData();
    }, []);

    const addToCart = (product) => {
        const existing = cart.find(item => item.productId === product._id);
        if (existing) {
            setCart(cart.map(item =>
                item.productId === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                productId: product._id,
                name: product.name,
                price: product.sellingPrice,
                quantity: 1,
                image: product.image
            }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.productId !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.productId === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const [cashReceived, setCashReceived] = useState('');
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotal * (store.taxPercentage / 100 || 0);
    const total = subtotal + taxAmount - discount;

    const balance = cashReceived ? (Number(cashReceived) - total) : 0;

    const handleCheckout = async () => {
        if (cart.length === 0) return toast.warning('Cart is empty');
        if (Number(cashReceived) < total) return toast.error('Check cash amount');

        try {
            await api.post('/sales', {
                items: cart,
                subtotal,
                tax: taxAmount,
                discount,
                total,
                paymentMethod: 'Cash',
                cashReceived: Number(cashReceived),
                balance: balance
            });
            toast.success('Sale completed!');
            setCart([]);
            setDiscount(0);
            setCashReceived('');
            setIsCheckingOut(false);
            window.print(); // Basic receipt print
        } catch (err) {
            toast.error('Checkout failed');
        }
    };

    const filteredProducts = Array.isArray(products) ? products
        .filter(p => p.purpose === 'sale' || !p.purpose) // !p.purpose for existing products
        .filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
        ) : [];

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 400px',
            height: isMobile ? 'calc(100vh - var(--top-nav-height))' : '100vh',
            overflow: 'hidden'
        }}>
            {/* Mobile Cart Toggle */}
            {isMobile && (
                <button
                    className="cart-fab"
                    onClick={() => setShowCart(!showCart)}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ShoppingCart size={24} />
                    {cart.length > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: 'white',
                            color: 'var(--primary)',
                            width: '24px',
                            height: '24px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            border: '2px solid var(--primary)'
                        }}>
                            {cart.length}
                        </span>
                    )}
                </button>
            )}

            {/* Products Area */}
            <div style={{
                padding: isMobile ? '1rem' : '2rem',
                overflowY: 'auto',
                backgroundColor: 'var(--bg-main)',
                display: (isMobile && showCart) ? 'none' : 'block'
            }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div className="card" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem 1.25rem',
                        borderRadius: '24px',
                        background: 'var(--bg-card)',
                        border: '2px solid var(--border-light)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <Search size={22} color="var(--text-muted)" />
                        <input
                            placeholder="Search by name or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: 'none', background: 'transparent', fontSize: '1.1rem', padding: '0' }}
                        />
                    </div>
                </div>

                <div className="grid" style={{
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: isMobile ? '0.75rem' : '1.5rem'
                }}>                    {filteredProducts.map(product => (
                    <div
                        key={product._id}
                        className="card"
                        onClick={() => addToCart(product)}
                        style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                    >
                        <div style={{ height: '120px', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {product.image ? (
                                <img src={getImageUrl(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : <Package size={32} color="var(--text-muted)" />}
                        </div>
                        <div style={{ padding: '0.75rem' }}>
                            <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{product.name}</p>
                            <p style={{ color: 'var(--primary)', fontWeight: '700' }}>Rs. {product.sellingPrice}</p>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Cart Area */}
            <div
                className={`glass ${isMobile && !showCart ? 'hidden' : ''}`}
                style={{
                    borderLeft: isMobile ? 'none' : '1px solid var(--border)',
                    display: (isMobile && !showCart) ? 'none' : 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    position: isMobile ? 'fixed' : 'relative',
                    inset: isMobile ? '0 0 0 0' : 'auto',
                    zIndex: isMobile ? 1200 : 'auto',
                    backgroundColor: 'var(--bg-card)',
                    paddingTop: isMobile ? 'var(--safe-top)' : '0'
                }}
            >
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingCart size={isMobile ? 28 : 24} /> {isMobile ? 'Your Cart' : 'Current Order'}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {isMobile && (
                            <button
                                onClick={() => setShowCart(false)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'var(--accent)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.9rem',
                                    borderRadius: '12px'
                                }}
                            >
                                Close
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (window.confirm('Clear all items?')) {
                                    setCart([]);
                                    setIsCheckingOut(false);
                                }
                            }}
                            style={{
                                padding: '0.5rem',
                                background: 'none',
                                color: 'var(--error)',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}
                        >
                            Empty
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Your cart is empty</p>
                        </div>
                    ) : cart.map(item => (
                        <div key={item.productId} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--accent)', borderRadius: '8px', overflow: 'hidden' }}>
                                {item.image ? <img src={getImageUrl(item.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={20} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.name}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>
                                    Rs. {item.price}
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--accent)', padding: '0.25rem', borderRadius: '8px' }}>
                                <button onClick={() => updateQuantity(item.productId, -1)} style={{ width: '24px', height: '24px' }}><Minus size={14} /></button>
                                <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.productId, 1)} style={{ width: '24px', height: '24px' }}><Plus size={14} /></button>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.productId)}
                                style={{ color: 'var(--error)', background: 'none', padding: '0.5rem' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)', paddingBottom: isMobile ? '2rem' : '1.5rem' }}>

                    {isCheckingOut ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '700' }}>
                                <span>Payable:</span>
                                <span style={{ color: 'var(--primary)' }}>Rs. {total.toFixed(2)}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Cash Received</label>
                                <input
                                    type="number"
                                    autoFocus
                                    placeholder="Enter amount"
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    style={{
                                        height: '56px',
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                        borderRadius: '16px',
                                        border: '2px solid var(--primary)',
                                        color: 'var(--text-main)',
                                        fontWeight: '700'
                                    }}
                                />
                            </div>

                            {Number(cashReceived) > 0 && (
                                <div style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    backgroundColor: Number(cashReceived) >= total ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontWeight: '600' }}>
                                        {Number(cashReceived) >= total ? 'Balance to return:' : 'Amount still due:'}
                                    </span>
                                    <span style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '800',
                                        color: Number(cashReceived) >= total ? 'var(--success)' : 'var(--error)'
                                    }}>
                                        Rs. {Math.abs(balance).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                                <button
                                    onClick={() => setIsCheckingOut(false)}
                                    style={{ height: '56px', borderRadius: '16px', background: 'var(--accent)', color: 'var(--text-main)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-primary"
                                    disabled={!cashReceived || Number(cashReceived) < total}
                                    onClick={handleCheckout}
                                    style={{
                                        height: '56px',
                                        borderRadius: '16px',
                                        fontSize: '1.1rem',
                                        opacity: (!cashReceived || Number(cashReceived) < total) ? 0.5 : 1
                                    }}
                                >
                                    Complete Order
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <span>Subtotal</span>
                                    <span>Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <span>Tax ({store.taxPercentage}%)</span>
                                    <span>Rs. {taxAmount.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Discount</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rs</span>
                                        <input
                                            type="number"
                                            value={discount}
                                            onChange={(e) => setDiscount(Number(e.target.value))}
                                            style={{ width: '70px', padding: '0.4rem', textAlign: 'right', fontSize: '1rem', borderRadius: '8px' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                    <span>Total</span>
                                    <span>Rs. {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                className="btn-primary"
                                onClick={() => setIsCheckingOut(true)}
                                style={{
                                    width: '100%',
                                    height: '56px',
                                    borderRadius: '16px',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 4px 12px rgba(217, 70, 239, 0.3)'
                                }}
                            >
                                <Banknote size={24} /> Pay with Cash
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default POS;
