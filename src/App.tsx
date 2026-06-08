import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Reservations from './Reservations';
import NotFound from './NotFound';
import Signup from './Signup';
import Login from './Login';
import ManagerDashboard from './ManagerDashboard';
import HQManagerDashboard from './HQManagerDashboard';
import ChefDashboard from './ChefDashboard';
import CashierDashboard from './CashierDashboard';
import UserManagement from './UserManagement';
import BranchManagement from './BranchManagement';
import AccessLog from './AccessLog';
import InventoryManagement from './InventoryManagement';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import PaymentHistory from './PaymentHistory';
import Menu from './Menu';
import Contact from './Contact';
import LeaveReview from './LeaveReview';
import ManagerStaff from './ManagerStaff';
import ManagerMenu from './ManagerMenu';
import ManagerInventory from './ManagerInventory';
import ManagerReservations from './ManagerReservations';
import ManagerSales from './ManagerSales';
import HQManagerStaff from './HQManagerStaff';
import HQManagerMenu from './HQManagerMenu';
import HQManagerInventory from './HQManagerInventory';
import HQManagerReservations from './HQManagerReservations';
import HQManagerSales from './HQManagerSales';
import ChefOrders from './ChefOrders';
import ChefOrderHistory from './ChefOrderHistory';
import PaymentProcessing from './PaymentProcessing';

function App() {
  // HQ manager redirect logic
  useEffect(() => {
    const role = localStorage.getItem('role');
    if ((role === 'HQMANAGER' || role === 'hqmanager' || role === 'HQ_MANAGER') && window.location.pathname === '/') {
      window.location.replace('/hqmanager-staff');
    }
  }, []);

  // Admin redirect logic
  useEffect(() => {
    const role = localStorage.getItem('role');
    if ((role === 'ADMIN' || role === 'admin') && (window.location.pathname === '/' || window.location.pathname === '/admin' || window.location.pathname === '/admin-dashboard')) {
      window.location.replace('/user-management');
    }
  }, []);

  // Chef redirect logic
  useEffect(() => {
    const role = localStorage.getItem('role');
    if ((role === 'CHEF' || role === 'chef') && (window.location.pathname === '/' || window.location.pathname === '/chef' || window.location.pathname === '/chef-dashboard')) {
      window.location.replace('/chef-order-history');
    }
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/reservations" component={Reservations} />
          <Route path="/manager" component={ManagerDashboard} />
          <Route path="/hqmanager" component={HQManagerDashboard} />
          <Route path="/chef" component={ChefDashboard} />
          <Route path="/cashier" component={CashierDashboard} />
          <Route path="/user-management" component={UserManagement} />
          <Route path="/branch-management" component={BranchManagement} />
          <Route path="/access-log" component={AccessLog} />
          <Route path="/inventory-management" component={InventoryManagement} />
          <Route path="/menu-management" component={MenuManagement} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/order-management" component={OrderManagement} />
          <Route path="/payment-history" component={PaymentHistory} />
          <Route path="/menu" component={Menu} />
          <Route path="/contact" component={Contact} />
          <Route path="/review" component={LeaveReview} />
          <Route path="/manager-staff" component={ManagerStaff} />
          <Route path="/manager-menu" component={ManagerMenu} />
          <Route path="/manager-inventory" component={ManagerInventory} />
          <Route path="/manager-reservations" component={ManagerReservations} />
          <Route path="/manager-sales" component={ManagerSales} />
          <Route path="/hqmanager-staff" component={HQManagerStaff} />
          <Route path="/hqmanager-menu" component={HQManagerMenu} />
          <Route path="/hqmanager-inventory" component={HQManagerInventory} />
          <Route path="/hqmanager-reservations" component={HQManagerReservations} />
          <Route path="/hqmanager-sales" component={HQManagerSales} />
          <Route path="/chef-orders" component={ChefOrders} />
          <Route path="/chef-order-history" component={ChefOrderHistory} />
          <Route path="/cashier-payment" component={PaymentProcessing} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

export default App;