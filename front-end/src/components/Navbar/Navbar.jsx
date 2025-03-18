import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate for programmatic navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/Logo/xlevr.png';
import styles from './Navbar.module.css';
import Modal from '../Modal/Modal'; // Import the Modal component

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false); // State for the modal
    const navigate = useNavigate(); // Hook for navigation

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleJoinAsStudent = () => {
      navigate('/signup?role=student'); // Navigate with query parameter
      closeModal();
      closeMenu()
    };

    const handleJoinAsProfessional = () => {
      navigate('/signup?role=professional'); // Navigate with query parameter
      closeModal();
      closeMenu();
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
                        <button className={styles['join']} onClick={openModal}>Join</button>
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
                <button className={styles['join']} onClick={openModal}>Join</button>
            </div>

            {/* Modal */}
            <Modal isOpen={modalOpen} onClose={closeModal}>
                <h2>Join as...</h2>
                <p>Are you a student or a professional?</p>
                <button onClick={handleJoinAsStudent}>Join as Student</button>
                <button onClick={handleJoinAsProfessional}>Join as Professional</button>
            </Modal>
        </nav>
    );
}

export default Navbar;