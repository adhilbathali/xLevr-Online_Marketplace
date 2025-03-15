import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/Logo/xlevr.png'; // Make sure the path is correct
import styles from './Navbar.module.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles['logo-container']}>
        <Link to="/">
          <img src={Logo} alt="xlevr" className={styles.logo} />
        </Link>
      </div>

      {/* Hamburger Menu Icon */}
      <div
        className={`${styles['menu-icon']} ${menuOpen ? styles['white-icon'] : ''}`}
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
      </div>

      {/* Mobile Navigation */}
      <div className={`${styles['mobile-nav']} ${menuOpen ? styles.open : ''}`}>
        <ul className={styles['mobile-list']} onClick={closeMenu}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          <li><Link to="/how-it-works">How it Works</Link></li>
          <li className={styles['cta-mobile']}>
             <Link to="/login"><button className={styles['sign-in']}>Sign in</button></Link>
            <Link to="/signup"><button className={styles['join']}>Join</button></Link>
          </li>
        </ul>
      </div>

      {/* Desktop Navigation */}
      <ul className={styles['navbar-list']}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/how-it-works">How it Works</Link></li>
      </ul>

      {/* CTA Buttons */}
      <div className={styles.cta}>
        <Link to="/login"><button className={styles['sign-in']}>Sign in</button></Link>
        <Link to="/signup"><button className={styles['join']}>Join</button></Link>
      </div>
    </nav>
  );
}

export default Navbar;