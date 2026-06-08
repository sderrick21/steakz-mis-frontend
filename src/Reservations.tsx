import React, { useState } from 'react';

const RESERVATIONS_KEY = 'sharedReservations';

const Reservations: React.FC = () => {
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const reservation = {
      id: Date.now().toString(),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      time: formData.get('time'),
      guests: formData.get('guests'),
    };
    // Save to localStorage (append to sharedReservations)
    const existing = localStorage.getItem(RESERVATIONS_KEY);
    const reservations = existing ? JSON.parse(existing) : [];
    reservations.push(reservation);
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
    setBookingSuccess(true);
    form.reset();
  };

  return (
    <div className="container">
      <h1>Book a Table</h1>
      <div className="card" style={{ maxWidth: 500, margin: '2rem auto' }}>
        {bookingSuccess ? (
          <div style={{ color: '#16a34a', textAlign: 'center', margin: '1.5rem 0' }}>
            <strong>Your table has been booked! We look forward to seeing you.</strong>
          </div>
        ) : (
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
            <label>
              Name
              <input type="text" name="name" required placeholder="Your Name" />
            </label>
            <label>
              Email
              <input type="email" name="email" required placeholder="you@email.com" />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" required placeholder="05XXXXXXXX" />
            </label>
            <label>
              Date
              <input type="date" name="date" required />
            </label>
            <label>
              Time
              <input type="time" name="time" required />
            </label>
            <label>
              Guests
              <input type="number" name="guests" min="1" max="20" required placeholder="Number of guests" />
            </label>
            <button type="submit" className="btn">Book Now</button>
          </form>
        )}
        <p style={{ marginTop: '1.5rem', color: '#e0b07d', textAlign: 'center' }}>
          For group bookings or special requests, please call us at <strong>(+971) 123-4567</strong>.
        </p>
      </div>
    </div>
  );
};

export default Reservations;
