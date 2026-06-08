import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <div className="bg-white p-4 rounded shadow">
        <p className="mb-2"><span className="font-semibold">Phone:</span> (555) 123-4567</p>
        <p className="mb-2"><span className="font-semibold">Email:</span> info@staceysteakz.com</p>
        <p className="mb-2"><span className="font-semibold">Address:</span> 123 Main St, Steak City, USA</p>
        <p className="mb-2"><span className="font-semibold">Hours:</span> Mon-Sun, 11:00am - 10:00pm</p>
      </div>
    </div>
  );
};

export default Contact;
