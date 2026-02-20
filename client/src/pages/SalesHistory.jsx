import { useState, useEffect } from 'react';
import { History, Calendar, ShoppingBag, Banknote, CreditCard, ExternalLink, ChevronRight, Hash, Download } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import useMobile from '../hooks/useMobile';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [store, setStore] = useState({});
    const [loading, setLoading] = useState(true);
    const isMobile = useMobile();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesRes, storeRes] = await Promise.all([
                    api.get('/sales'),
                    api.get('/store')
                ]);
                setSales(salesRes.data);
                setStore(storeRes.data);
            } catch (err) {
                toast.error('Failed to load history');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const getBase64Image = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = (error) => reject(error);
            img.src = url;
        });
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
    };

    const generatePDF = async (sale) => {
        const doc = new jsPDF();
        const currency = "Rs. ";

        // Add Logo if available
        if (store.image) {
            try {
                const logoUrl = getImageUrl(store.image);
                const imgData = await getBase64Image(logoUrl);
                doc.addImage(imgData, 'PNG', 20, 10, 25, 25);
            } catch (err) {
                console.warn('Could not add logo to PDF:', err);
            }
        }

        // Header
        doc.setFontSize(26);
        doc.setTextColor(217, 70, 239); // Primary color
        doc.setFont(undefined, 'bold');
        doc.text('Glass House', 105, 22, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont(undefined, 'normal');
        doc.text(store.address || '', 105, 30, { align: 'center' });
        doc.text(`Contact: ${store.contactNumber || ''}`, 105, 35, { align: 'center' });

        doc.setDrawColor(200);
        doc.line(20, 42, 190, 42);

        // Transaction Info
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`INVOICE: #${sale._id.slice(-6).toUpperCase()}`, 20, 52);
        doc.text(`Date: ${new Date(sale.createdAt).toLocaleString()}`, 20, 59);
        doc.text(`Payment: ${sale.paymentMethod}`, 20, 66);

        // Table
        const tableColumn = ["Item", "Price", "Qty", "Total"];
        const tableRows = [];

        sale.items.forEach(item => {
            const itemData = [
                item.name,
                `${currency}${item.price.toFixed(2)}`,
                item.quantity,
                `${currency}${(item.price * item.quantity).toFixed(2)}`
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            startY: 80,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [217, 70, 239] },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { halign: 'right' },
                2: { halign: 'center' },
                3: { halign: 'right' }
            }
        });

        const finalY = doc.lastAutoTable.finalY + 10;

        // Totals
        doc.setFontSize(10);
        doc.text(`Subtotal:`, 140, finalY);
        doc.text(`${currency}${sale.subtotal.toFixed(2)}`, 190, finalY, { align: 'right' });

        doc.text(`Tax (${store.taxPercentage}%):`, 140, finalY + 7);
        doc.text(`${currency}${sale.tax.toFixed(2)}`, 190, finalY + 7, { align: 'right' });

        if (sale.discount > 0) {
            doc.text(`Discount:`, 140, finalY + 14);
            doc.text(`-${currency}${sale.discount.toFixed(2)}`, 190, finalY + 14, { align: 'right' });
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`TOTAL:`, 140, finalY + 22);
        doc.text(`${currency}${sale.total.toFixed(2)}`, 190, finalY + 22, { align: 'right' });

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Paid Amount:`, 140, finalY + 30);
        doc.text(`${currency}${(sale.cashReceived || sale.total).toFixed(2)}`, 190, finalY + 30, { align: 'right' });

        doc.text(`Balance:`, 140, finalY + 37);
        doc.text(`${currency}${(sale.balance || 0).toFixed(2)}`, 190, finalY + 37, { align: 'right' });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Thank you for your business!", 105, finalY + 55, { align: 'center' });

        doc.save(`Invoice_${sale._id.slice(-6)}.pdf`);
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <div className="loader"></div>
        </div>
    );

    const TransactionCard = ({ sale }) => (
        <div className="glass" style={{
            padding: '1.25rem',
            borderRadius: '20px',
            marginBottom: '1rem',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)'
                    }}>
                        <Hash size={20} />
                    </div>
                    <div>
                        <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>#{sale._id.slice(-6)}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={12} />
                            {new Date(sale.createdAt).toLocaleDateString()} • {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-main)' }}>Rs. {sale.total.toFixed(2)}</p>
                    <span style={{
                        fontSize: '0.7rem',
                        backgroundColor: sale.paymentMethod === 'Cash' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(194, 24, 91, 0.1)',
                        color: sale.paymentMethod === 'Cash' ? 'var(--success)' : 'var(--primary)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                    }}>
                        {sale.paymentMethod}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--accent)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Received:</span>
                    <span style={{ fontWeight: '600' }}>Rs. {(sale.cashReceived || sale.total).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Balance:</span>
                    <span style={{ fontWeight: '600', color: 'var(--success)' }}>Rs. {(sale.balance || 0).toFixed(2)}</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <ShoppingBag size={14} />
                    <span>{sale.items.length} Items</span>
                </div>
                <button
                    onClick={() => generatePDF(sale)}
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.6rem 1rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(194, 24, 91, 0.2)'
                    }}
                >
                    <Download size={16} /> PDF <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ paddingBottom: isMobile ? '5rem' : '2rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Sales History</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Track and manage your past transactions</p>
            </div>

            {sales.length === 0 ? (
                <div style={{ padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'var(--accent)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        opacity: 0.5
                    }}>
                        <History size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No orders yet</h3>
                    <p>Once you start making sales, they will appear here.</p>
                </div>
            ) : (
                isMobile ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {sales.map(sale => <TransactionCard key={sale._id} sale={sale} />)}
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--accent)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Transaction ID</th>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Date & Time</th>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Received</th>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Balance</th>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Total</th>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale) => (
                                    <tr key={sale._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s ease' }} className="table-row-hover">
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>#{sale._id.slice(-6)}</td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Calendar size={14} color="var(--text-muted)" />
                                                {new Date(sale.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>
                                            Rs. {(sale.cashReceived || sale.total).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--success)' }}>
                                            Rs. {(sale.balance || 0).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '800', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                                            Rs. {sale.total.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <button
                                                onClick={() => generatePDF(sale)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--primary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Download size={16} /> PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            <style>{`
                .table-row-hover:hover {
                    background-color: var(--accent);
                }
                .loader {
                    width: 48px;
                    height: 48px;
                    border: 5px solid var(--accent);
                    border-bottom-color: var(--primary);
                    border-radius: 50%;
                    display: inline-block;
                    box-sizing: border-box;
                    animation: rotation 1s linear infinite;
                }
                @keyframes rotation {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SalesHistory;
