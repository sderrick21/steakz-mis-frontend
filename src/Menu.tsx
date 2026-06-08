import React, { useEffect, useState } from 'react';

const MENU_KEY = 'sharedMenu';
const ORDERS_KEY = 'sharedOrders';
const PAYMENTS_KEY = 'sharedPayments';
const defaultMenuItems = [
  { id: 1, name: 'Ribeye Steak', category: 'Mains', price: 32 },
  { id: 2, name: 'Caesar Salad', category: 'Appetizers', price: 12 },
  { id: 3, name: 'Chocolate Lava Cake', category: 'Desserts', price: 10 },
  { id: 4, name: 'Lemonade', category: 'Drinks', price: 5 },
];
function getMenuItems() {
  const items = localStorage.getItem(MENU_KEY);
  return items ? JSON.parse(items) : defaultMenuItems;
}

function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function setCart(cart: any[]) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

const Menu: React.FC = () => {
  const [menuItems, setMenuItemsState] = useState<any[]>(getMenuItems());
  const [cart, setCartState] = useState<any[]>(getCart());
  const [showCheckout, setShowCheckout] = useState(false);

  // Real-time sync for menu and cart
  useEffect(() => {
    const sync = () => {
      setMenuItemsState(getMenuItems());
      setCartState(getCart());
    };
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, []);

  // Write to localStorage on change
  const updateCart = (newCart: any[]) => {
    setCartState(newCart);
    setCart(newCart);
  };

  const addToCart = (item: any) => {
    const found = cart.find((i: any) => i.id === item.id);
    let newCart;
    if (found) {
      newCart = cart.map((i: any) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
    } else {
      newCart = [...cart, { ...item, qty: 1 }];
    }
    updateCart(newCart);
  };

  const removeFromCart = (id: number) => {
    updateCart(cart.filter(i => i.id !== id));
  };

  const updateQty = (id: number, qty: number) => {
    updateCart(cart.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleConfirm = () => {
    // Create new order and save to sharedOrders
    const order = {
      id: Date.now().toString(),
      table: 'Online', // or prompt for table/guest info if needed
      items: cart.map(i => ({ name: i.name, quantity: i.qty, price: i.price })),
      status: 'pending',
      total,
      createdAt: new Date().toISOString(),
    };
    const existing = localStorage.getItem(ORDERS_KEY);
    const orders = existing ? JSON.parse(existing) : [];
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Add payment to sharedPayments for cashier dashboard
    const paymentsRaw = localStorage.getItem(PAYMENTS_KEY);
    const payments = paymentsRaw ? JSON.parse(paymentsRaw) : [];
    const newPayment = {
      id: Date.now().toString(),
      orderId: order.id,
      amount: order.total,
      method: 'Online', // or prompt/select method if needed
      timestamp: new Date().toISOString(),
    };
    payments.push(newPayment);
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

    updateCart([]);
    setShowCheckout(false);
    alert('Thank you for your order!');
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {menuItems.map((item: any) => (
          <div key={item.id} className="border rounded p-4 flex flex-col items-start">
            <div className="font-bold text-lg">{item.name}</div>
            <div className="text-sm text-gray-500 mb-2">{item.category}</div>
            <div className="text-green-700 font-semibold mb-2">${item.price}</div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Cart</h2>
        {cart.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <table className="w-full text-left mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Item</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Total</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(i => (
                <tr key={i.id} className="border-t">
                  <td className="p-2">{i.name}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      min={1}
                      value={i.qty}
                      onChange={e => updateQty(i.id, Number(e.target.value))}
                      className="border p-1 rounded w-16"
                    />
                  </td>
                  <td className="p-2">${i.price}</td>
                  <td className="p-2">${i.price * i.qty}</td>
                  <td className="p-2">
                    <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => removeFromCart(i.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="font-bold mb-2">Total: ${total}</div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleCheckout}
          disabled={cart.length === 0}
        >
          Checkout
        </button>
      </div>
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Your Order</h2>
            <div className="mb-4">Order Total: <span className="font-semibold">${total}</span></div>
            <button className="bg-green-600 text-white px-4 py-2 rounded mr-2" onClick={handleConfirm}>Confirm</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowCheckout(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
