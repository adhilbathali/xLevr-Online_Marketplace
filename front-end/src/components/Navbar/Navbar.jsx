import Logo from '../../assets/Logo/xlevr.png'
import styles from'./Navbar.module.css'
import { Link } from 'react-router-dom'

export default function Navbar(){
    return(
        <nav className={styles.navbar}>
            <div className={styles["logo-container"]}>
                    <img src={Logo} alt="xlevr" className={styles["logo"]} />
            </div>
            
            <ul className={styles["navbar-list"]}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/how-it-works">How it Works</Link></li>
            </ul>

            <div className={styles["cta"]}>
                <button className={styles["sign-in"]}>Sign in</button>
                <button className={styles["join"]}>join</button>
            </div>
        </nav> 
    )
}