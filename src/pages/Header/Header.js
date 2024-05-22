import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo-container" onClick={() => navigate('/')}>
        Sportski centar
      </div>
      <nav className="nav-menu">
        <ul>
          <li onClick={() => navigate('/')}>Naslovna</li>
          <li onClick={() => navigate('/activities')}>Aktivnosti</li>
          <li onClick={() => navigate('/reservations')}>Moje rezervacije</li>
          <li onClick={() => navigate('/statuses')}>Statusi Rezervacija</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
