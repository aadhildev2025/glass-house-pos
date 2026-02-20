import { useState, useEffect } from 'react';
import { Store, User, MapPin, Phone, Hash, DollarSign, Percent } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';

import useMobile from '../hooks/useMobile';

const StoreData = () => {
    const isMobile = useMobile();
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        storeName: '',
        branchName: '',
        address: '',
        contactNumber: '',
        taxNumber: '',
        currency: 'USD',
        taxPercentage: 0
    });

    const fetchStoreData = async () => {
        try {
            const { data } = await api.get('/store');
            if (data._id) {
                setFormData({
                    storeName: data.storeName || '',
                    branchName: data.branchName || '',
                    address: data.address || '',
                    contactNumber: data.contactNumber || '',
                    taxNumber: data.taxNumber || '',
                    currency: data.currency || 'USD',
                    taxPercentage: data.taxPercentage || 0
                });
                if (data.image) {
                    setImagePreview(getImageUrl(data.image));
                }
            }
        } catch (err) {
            toast.error('Failed to fetch store data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStoreData();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
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
            await api.put('/store', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Store settings updated');
            fetchStoreData();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1>Store Data Management</h1>
                <p style={{ color: 'var(--text-muted)' }}>Configure your business details</p>
            </div>

            <div className="card" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit} className="grid">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div
                            onClick={() => document.getElementById('store-logo-upload').click()}
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '24px',
                                backgroundColor: 'var(--accent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                border: '2px dashed var(--border)',
                                position: 'relative',
                                transition: 'all 0.3s ease'
                            }}
                            className="logo-upload-hover"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Store size={40} style={{ marginBottom: '0.5rem' }} />
                                    <p style={{ fontSize: '0.8rem' }}>Upload Brand Logo</p>
                                </div>
                            )}
                        </div>
                        <input
                            id="store-logo-upload"
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recommended: Square image, max 5MB</p>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                <Store size={18} /> Store Name
                            </label>
                            <input
                                required
                                placeholder="Nishad Retail"
                                value={formData.storeName}
                                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                <User size={18} /> Branch Name
                            </label>
                            <input
                                required
                                placeholder="Main Branch"
                                value={formData.branchName}
                                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                            <MapPin size={18} /> Store Address
                        </label>
                        <input
                            required
                            placeholder="123 Shopping St, Downtown"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                <Phone size={18} /> Contact Number
                            </label>
                            <input
                                required
                                placeholder="+1 234 567 890"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                <Hash size={18} /> Tax / VAT Number
                            </label>
                            <input
                                placeholder="TAX-9988-77"
                                value={formData.taxNumber}
                                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                <DollarSign size={18} /> Currency
                            </label>
                            <select
                                style={{
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius)',
                                    padding: '0.75rem 1rem',
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="LKR">LKR (Rs)</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                <Percent size={18} /> Tax Percentage (%)
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={formData.taxPercentage}
                                onChange={(e) => setFormData({ ...formData, taxPercentage: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
                        Save Store Settings
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StoreData;
