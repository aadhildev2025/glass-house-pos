import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, History, Settings, Store } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { icon: ShoppingCart, label: 'POS', path: '/' },
        { icon: Package, label: 'Products', path: '/products' },
        { icon: History, label: 'History', path: '/history' },
        { icon: Store, label: 'Store', path: '/store' },
    ];

    return (
        <nav className="glass mobile-bottom-nav">
            {navItems.map((item) => (
                <Link
                    key={item.label}
                    to={item.path}
                    className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                    <item.icon size={24} />
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
};

export default BottomNav;
