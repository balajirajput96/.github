import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#333', padding: '1rem' }}>
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-around', margin: 0, padding: 0 }}>
        <li><a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
        <li><a href="/about" style={{ color: 'white', textDecoration: 'none' }}>About</a></li>
        <li><a href="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;