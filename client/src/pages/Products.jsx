import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Package } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        sellingPrice: '',
        costPrice: '',
        quantity: '',
        stockTracking: true,
        purpose: 'sale',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (err) {
            toast.error('Failed to fetch products');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product updated');
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product added');
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', category: '', sellingPrice: '', costPrice: '', quantity: '', stockTracking: true });
            setImageFile(null);
            setImagePreview(null);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDeleteClick = (id) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/products/${productToDelete}`);
            toast.success('Product deleted');
            fetchProducts();
        } catch (err) {
            toast.error('Delete failed');
        } finally {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        }
    };

    const filteredProducts = products
        .filter(p => p.purpose === 'sale' || !p.purpose)
        .filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
        );

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Product Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your inventory here</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({ name: '', category: '', sellingPrice: '', costPrice: '', quantity: '', stockTracking: true });
                        setImageFile(null);
                        setImagePreview(null);
                        setIsModalOpen(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Search size={20} color="var(--text-muted)" />
                <input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ border: 'none', padding: '0.5rem' }}
                />
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {filteredProducts.map(product => (
                        <div key={product._id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ height: '180px', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {product.image ? (
                                    <img src={getImageUrl(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : <Package size={48} color="var(--text-muted)" />}
                            </div>
                            <div style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem' }}>{product.name}</h3>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: 'var(--accent)',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)'
                                    }}>{product.category}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>Rs. {product.sellingPrice}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Qty: {product.quantity || '∞'}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => {
                                            setEditingProduct(product);
                                            setFormData({
                                                name: product.name,
                                                category: product.category,
                                                sellingPrice: product.sellingPrice,
                                                costPrice: product.costPrice,
                                                quantity: product.quantity,
                                                stockTracking: product.stockTracking
                                            });
                                            setImagePreview(getImageUrl(product.image));
                                            setImageFile(null);
                                            setIsModalOpen(true);
                                        }}
                                        style={{ flex: 1, padding: '0.5rem', backgroundColor: 'var(--accent)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(product._id)}
                                        style={{ padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid" style={{ gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                <div
                                    onClick={() => document.getElementById('product-image-upload').click()}
                                    style={{
                                        width: '120px',
                                        height: '120px',
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
                                    ) : <Plus size={32} color="var(--text-muted)" />}
                                </div>
                                <input
                                    id="product-image-upload"
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <input
                                placeholder="Product Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                placeholder="Category"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="number"
                                    placeholder="Selling Price"
                                    required
                                    value={formData.sellingPrice}
                                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Cost Price (Optional)"
                                    value={formData.costPrice}
                                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                />
                            </div>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                min="0"
                            />
                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${products.find(p => p._id === productToDelete)?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default Products;
