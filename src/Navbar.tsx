import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const handleStorage = () => setRole(localStorage.getItem('role'));
    window.addEventListener('storage', handleStorage);
    setRole(localStorage.getItem('role'));
    // Listen for route changes to update role immediately after logout
    const handlePopState = () => setRole(localStorage.getItem('role'));
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // const isCustomer = role === 'CUSTOMER' || role === 'customer';
  const isAdmin = role === 'ADMIN' || role === 'admin';
  const isManager = role === 'MANAGER' || role === 'manager';
  const isHQManager = role === 'HQMANAGER' || role === 'hqmanager' || role === 'HQ_MANAGER';
  // const isChef = role === 'CHEF' || role === 'chef';
  const isCashier = role === 'CASHIER' || role === 'cashier' || role === 'WAITER_CASHIER' || role === 'waiter_cashier';
  const isWaiter = role === 'WAITER' || role === 'waiter';

  const handleLogout = () => {
    localStorage.removeItem('role');
    setRole(null);
    window.location.href = '/'; // Force redirect to home after logout
  };

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0.5rem 1rem',
      }}>
        <div style={{ fontFamily: 'Montserrat, serif', fontWeight: 900, fontSize: '2rem', color: '#e0b07d', letterSpacing: '2px' }}>
          <Link to="/" style={{ color: '#e0b07d', textDecoration: 'none' }}>
            <span style={{ fontWeight: 900, fontSize: '2.2rem', letterSpacing: '2px' }}>STEAKZ MIS</span>
          </Link>
        </div>
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, alignItems: 'center' }}>
          {/* Hide menu, reservations, contact, and review for admin, cashier, manager, hq manager, and chef */}
          {!isAdmin && !isCashier && !isManager && !isHQManager && !(role === 'CHEF' || role === 'chef') && <li><Link to="/menu" style={{ color: '#e0b07d', textDecoration: 'none' }}>Menu</Link></li>}
          {!isAdmin && !isCashier && !isManager && !isHQManager && !(role === 'CHEF' || role === 'chef') && <li><Link to="/reservations" style={{ color: '#e0b07d', textDecoration: 'none' }}>Book a Table</Link></li>}
          {!isAdmin && !isCashier && !isManager && !isHQManager && !(role === 'CHEF' || role === 'chef') && <li><Link to="/contact" style={{ color: '#e0b07d', textDecoration: 'none' }}>Contact Us</Link></li>}
          {!isAdmin && !isCashier && !isManager && !isHQManager && !(role === 'CHEF' || role === 'chef') && <li><Link to="/review" style={{ color: '#e0b07d', textDecoration: 'none' }}>Leave a Review</Link></li>}
          {/* {isAdmin && <li><Link to="/admin" style={{ color: '#e0b07d', textDecoration: 'none' }}>Admin Dashboard</Link></li>} */}
          {isManager && (
            <>
              <li><Link to="/manager-staff" style={{ color: '#e0b07d', textDecoration: 'none' }}>Staff Management</Link></li>
              <li><Link to="/manager-menu" style={{ color: '#e0b07d', textDecoration: 'none' }}>Menu Overview</Link></li>
              <li><Link to="/manager-inventory" style={{ color: '#e0b07d', textDecoration: 'none' }}>Inventory</Link></li>
              <li><Link to="/manager-reservations" style={{ color: '#e0b07d', textDecoration: 'none' }}>Reservations</Link></li>
              <li><Link to="/manager-sales" style={{ color: '#e0b07d', textDecoration: 'none' }}>Sales Analytics</Link></li>
            </>
          )}
          {isHQManager && (
            <>
              <li><Link to="/hqmanager-staff" style={{ color: '#e0b07d', textDecoration: 'none' }}>All Branch Staff</Link></li>
              <li><Link to="/hqmanager-menu" style={{ color: '#e0b07d', textDecoration: 'none' }}>All Branch Menus</Link></li>
              <li><Link to="/hqmanager-inventory" style={{ color: '#e0b07d', textDecoration: 'none' }}>All Branch Inventory</Link></li>
              <li><Link to="/hqmanager-reservations" style={{ color: '#e0b07d', textDecoration: 'none' }}>All Branch Reservations</Link></li>
              <li><Link to="/hqmanager-sales" style={{ color: '#e0b07d', textDecoration: 'none' }}>All Branch Sales Analytics</Link></li>
            </>
          )}
          {/* Chef links */}
          {(role === 'CHEF' || role === 'chef') && (
            <>
              <li>
                <a href="/chef-orders" className={window.location.pathname === '/chef-orders' ? 'active' : ''}>Chef Orders</a>
              </li>
              <li>
                <a href="/chef-order-history" className={window.location.pathname === '/chef-order-history' ? 'active' : ''}>Order History</a>
              </li>
            </>
          )}
          {/* {isChef && (
            <li><Link to="/chef" style={{ color: '#e0b07d', textDecoration: 'none' }}>Chef Dashboard</Link></li>
          )} */}
          {/* {isCashier && (
            <li><Link to="/cashier" style={{ color: '#e0b07d', textDecoration: 'none' }}>Cashier Dashboard</Link></li>
          )} */}
          {isAdmin && <li><Link to="/menu-management" style={{ color: '#e0b07d', textDecoration: 'none' }}>Menu Management</Link></li>}
          {isAdmin && <li><Link to="/user-management" style={{ color: '#e0b07d', textDecoration: 'none' }}>User Management</Link></li>}
          {isAdmin && <li><Link to="/branch-management" style={{ color: '#e0b07d', textDecoration: 'none' }}>Branch Management</Link></li>}
          {isAdmin && <li><Link to="/access-log" style={{ color: '#e0b07d', textDecoration: 'none' }}>Access Log</Link></li>}
          {isAdmin && <li><Link to="/inventory-management" style={{ color: '#e0b07d', textDecoration: 'none' }}>Inventory Management</Link></li>}
          {isWaiter && (
            <>
              <li><Link to="/waiter" style={{ color: '#e0b07d', textDecoration: 'none' }}>Place Order</Link></li>
            </>
          )}
          {isCashier && <li><Link to="/payment-history" style={{ color: '#e0b07d', textDecoration: 'none' }}>Payment History</Link></li>}
          {/* Show Payment Processing link robustly for any cashier role variant */}
          {(isCashier || (user && user.role && ['cashier','waiter_cashier','waiter_cashier','waiter-cashier','waiter cashier'].includes(user.role.toLowerCase()))) && (
            <li>
              <Link to="/cashier-payment" className="hover:underline">Payment Processing</Link>
            </li>
          )}
          {!role && <li><Link to="/signup" style={{ color: '#e0b07d', textDecoration: 'none' }}>Sign Up</Link></li>}
          {!role && <li><Link to="/login" style={{ color: '#e0b07d', textDecoration: 'none' }}>Log In</Link></li>}
          {role && (
            <li>
              <button
                style={{ color: '#e0b07d', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                onClick={handleLogout}
              >
                Log Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
