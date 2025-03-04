import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/Logo/xlevr.png";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles["logo-container"]}>
        <img src={Logo} alt="xlevr" className={styles["logo"]} />
      </div>

      {/* Hamburger Menu Icon */}
      <div 
  className={`${styles["menu-icon"]} ${menuOpen ? styles["white-icon"] : ""}`} 
  onClick={() => setMenuOpen(!menuOpen)}
>
  <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
</div>


      {/* Mobile Navigation */}
      <div className={`${styles["mobile-nav"]} ${menuOpen ? styles.open : ""}`}>
        <ul className={styles["mobile-list"]} onClick={() => setMenuOpen(false)}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          <li><Link to="/how-it-works">How it Works</Link></li>
          <li className={styles["cta-mobile"]}>
            <button className={styles["sign-in"]}>Sign in</button>
            <button className={styles["join"]}>Join</button>
          </li>
        </ul>
      </div>

      {/* Desktop Navigation */}
      <ul className={styles["navbar-list"]}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/how-it-works">How it Works</Link></li>
      </ul>

      {/* CTA Buttons */}
      <div className={styles["cta"]}>
        <button className={styles["sign-in"]}>Sign in</button>
        <button className={styles["join"]}>Join</button>
      </div>
    </nav>
  );
}
