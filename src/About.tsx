import React from 'react';

const About: React.FC = () => (
  <div className="container">
    <h1>About Stacey Steakz</h1>
    <div className="card" style={{ maxWidth: 800, margin: '2rem auto', background: '#221a15' }}>
      <p style={{ fontSize: '1.2rem', lineHeight: 1.7 }}>
        Stacey Steakz is a modern steakhouse inspired by the warmth of wood-fired cooking and the spirit of hospitality. Our story began with a passion for premium cuts, expertly grilled over real coals, and a desire to create a welcoming space for friends, families, and food lovers.
      </p>
      <p style={{ fontSize: '1.2rem', lineHeight: 1.7 }}>
        Our chefs source only the finest ingredients, and our menu features a curated selection of steaks, fresh seafood, and signature sides. Whether you're celebrating a special occasion or enjoying a casual night out, Stacey Steakz promises an unforgettable dining experience.
      </p>
      <ul style={{ marginTop: '2rem', color: '#e0b07d', fontWeight: 600 }}>
        <li>Hand-selected, aged steaks grilled over a real coal fire</li>
        <li>Signature cocktails and a curated wine list</li>
        <li>Private dining and group bookings available</li>
        <li>Warm, wood-inspired interiors and attentive service</li>
      </ul>
    </div>
  </div>
);

export default About;
