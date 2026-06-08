import React, { useEffect, useState } from 'react';

const MENU_KEY = 'sharedMenu';
const defaultMenu = [
  { id: 1, name: 'Ribeye Steak', category: 'Mains', price: 32 },
  { id: 2, name: 'Caesar Salad', category: 'Appetizers', price: 12 },
  { id: 3, name: 'Chocolate Lava Cake', category: 'Desserts', price: 10 },
  { id: 4, name: 'Lemonade', category: 'Drinks', price: 5 },
  { id: 5, name: 'Grilled Salmon', category: 'Mains', price: 28 },
  { id: 6, name: 'French Fries', category: 'Sides', price: 6 },
  { id: 7, name: 'Garden Salad', category: 'Appetizers', price: 9 },
  { id: 8, name: 'Iced Tea', category: 'Drinks', price: 4 },
  { id: 9, name: 'Tiramisu', category: 'Desserts', price: 11 },
  { id: 10, name: 'Chicken Wings', category: 'Appetizers', price: 13 }
];
function getMenu() {
  const data = localStorage.getItem(MENU_KEY);
  return data ? JSON.parse(data) : defaultMenu;
}
const HQManagerMenu: React.FC = () => {
  const [menu, setMenu] = useState<any[]>(getMenu());
  useEffect(() => {
    const sync = () => setMenu(getMenu());
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    // On mount, update sharedMenu if missing new items
    const current = getMenu();
    if (current.length < defaultMenu.length) {
      localStorage.setItem(MENU_KEY, JSON.stringify(defaultMenu));
      setMenu(defaultMenu);
    }
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">All Branch Menus</h1>
      <table className="w-full text-left border mb-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((m: any) => (
            <tr key={m.id} className="border-t">
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.category}</td>
              <td className="p-2">${m.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HQManagerMenu;
