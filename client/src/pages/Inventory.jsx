import { useState, useEffect } from 'react';
import { Warehouse, Search, PlusCircle, ArrowUpCircle, Package, AlertTriangle, X, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import useMobile from '../hooks/useMobile';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [adjustmentAmount, setAdjustmentAmount] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const isMobile = useMobile();

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        costPrice: 0,
        sellingPrice: 0,
        purpose: 'store'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (err) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append('image', imageFile);

        try {
            await api.post('/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Store item added');
            setIsModalOpen(false);
            setFormData({ name: '', category: '', quantity: '', costPrice: 0, sellingPrice: 0, purpose: 'store' });
            setImageFile(null);
            setImagePreview(null);
            fetchProducts();
        } catch (err) {
            toast.error('Failed to add item');
        }
    };

    const handleStockAdjustment = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !adjustmentAmount) return;

        try {
            const newQuantity = (selectedProduct.quantity || 0) + Number(adjustmentAmount);
            await api.put(`/products/${selectedProduct._id}`, {
                ...selectedProduct,
                quantity: newQuantity
            });
            toast.success(`Stock updated for ${selectedProduct.name}`);
            setAdjustmentAmount('');
            setSelectedProduct(null);
            fetchProducts();
        } catch (err) {
            toast.error('Stock update failed');
        }
    };

    const handleDeleteItem = async () => {
        if (!selectedProduct) return;
        try {
            await api.delete(`/products/${selectedProduct._id}`);
            toast.success('Item removed from store');
            setSelectedProduct(null);
            setShowDeleteConfirm(false);
            fetchProducts();
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    const filteredProducts = products
        .filter(p => p.purpose === 'store')
        .filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
        );

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading inventory...</div>;

    return (
        <div style={{ paddingBottom: isMobile ? '5rem' : '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Store</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Items kept in storage (not for sale)</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <PlusCircle size={20} /> Add Store Item
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                {/* Product List */}
                <div>
                    <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem' }}>
                        <Search size={20} color="var(--text-muted)" />
                        <input
                            placeholder="Find items in store..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1rem' }}
                        />
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Warehouse size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                            <p>No storage items found. Click "Add Store Item" to begin.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredProducts.map(product => (
                                <div
                                    key={product._id}
                                    className="card"
                                    onClick={() => setSelectedProduct(product)}
                                    style={{
                                        padding: '1rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        border: selectedProduct?._id === product._id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent)', overflow: 'hidden' }}>
                                            {product.image ? (
                                                <img src={getImageUrl(product.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : <Package size={20} color="var(--text-muted)" />}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '700' }}>{product.name}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{product.category}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '800',
                                            color: 'var(--text-main)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            justifyContent: 'flex-end'
                                        }}>
                                            {product.quantity}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In Stock</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stock Adjustment Panel */}
                <div className="glass" style={{
                    padding: '2rem',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                    position: isMobile ? 'relative' : 'sticky',
                    top: '2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowUpCircle size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Quick Edit Stock</h2>
                    </div>

                    {!selectedProduct ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                            <Warehouse size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <p>Select an item to add/remove quantity</p>
                        </div>
                    ) : (
                        <form onSubmit={handleStockAdjustment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--accent)', borderRadius: '12px' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Managing item:</p>
                                <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{selectedProduct.name}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.25rem' }}>Current: {selectedProduct.quantity}</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Change Quantity</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 10 or -5"
                                    autoFocus
                                    value={adjustmentAmount}
                                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                                    style={{
                                        height: '56px',
                                        fontSize: '1.25rem',
                                        textAlign: 'center',
                                        borderRadius: '16px',
                                        border: '2px solid var(--primary)'
                                    }}
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ height: '56px', borderRadius: '16px', fontWeight: '700' }}>
                                Update Quantity
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                style={{
                                    height: '56px',
                                    borderRadius: '16px',
                                    fontWeight: '700',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: 'var(--error)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    border: '1px solid rgba(239, 68, 68, 0.2)'
                                }}
                            >
                                <Trash2 size={20} /> Remove Item From Store
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.9rem' }}
                            >
                                Cancel Selection
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Add Item Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200
                }}>
                    <div className="card" style={{ width: '450px', maxWidth: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2>Add to Store</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddItem} className="grid" style={{ gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                <div
                                    onClick={() => document.getElementById('store-image-upload').click()}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '16px',
                                        backgroundColor: 'var(--accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        border: '2px dashed var(--border)'
                                    }}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : <PlusCircle size={24} color="var(--text-muted)" />}
                                </div>
                                <input
                                    id="store-image-upload"
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <input
                                placeholder="Item Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                placeholder="Category (e.g. Equipment, Furniture)"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Initial Quantity"
                                required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />

                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', height: '50px' }}>
                                Add to Storage
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && selectedProduct && (
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
                            <Trash2 size={32} />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Remove Item?</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Are you sure you want to remove <strong>{selectedProduct.name}</strong> from store? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
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
                                onClick={handleDeleteItem}
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
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .card { cursor: pointer; }
                .card:hover { transform: translateY(-2px); border-color: var(--primary); }
            `}</style>
        </div>
    );
};

export default Inventory;
