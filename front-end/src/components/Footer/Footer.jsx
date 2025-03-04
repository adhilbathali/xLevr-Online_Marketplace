import styles from "./Footer.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faXTwitter, faInstagram, faFacebook} from "@fortawesome/free-brands-svg-icons";

export default function Footer(){
    return(
        <footer className={styles["footer"]}>
            <div className={styles["footer-top"]}>
                <div className={styles["footer-top-list"]}>
                    <h4>For Professionals</h4>
                    <ul>
                        <li><a href=""></a>How to give requirements</li>
                        <li><a href=""></a>Track your orders</li>
                        <li><a href=""></a>How to rate your assignee</li>
                        <li><a href=""></a>How to pay</li>
                    </ul>
                </div>
                <div className={styles["footer-top-list"]}>
                    <h4>For Students</h4>
                    <ul>
                        <li><a href=""></a>Get more works</li>
                        <li><a href=""></a>How to setup your profile</li>
                        <li><a href=""></a>Profile Maintainance</li>
                        <li><a href=""></a></li>
                    </ul>
                </div>
                <div className={styles["footer-top-list"]}>
                    <h4>Company</h4>
                    <ul>
                        <li><a href=""></a>About Us</li>
                        <li><a href=""></a>Contact Us</li>
                        <li><a href=""></a>Our Team</li>
                        <li><a href=""></a>Careers</li>
                    </ul>
                </div>
            </div>
            <hr />
            <div className={styles["footer-bottom"]}>
                <div className={styles["social-icons"]}>
                    <a href="https://www.linkedin.com" target="_blank" >
                        <FontAwesomeIcon icon={faLinkedin} size="2x" />
                    </a>
                    <a href="https://twitter.com" target="_blank" >
                        <FontAwesomeIcon icon={faXTwitter} size="2x" />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" >
                        <FontAwesomeIcon icon={faInstagram} size="2x" />
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} size="2x" />
                    </a>
                </div>
                <div className={styles["copyright"]}>
                    <p>&copy; paaju.com 2025 All rights reserved</p>
                </div>
            </div>
        </footer>
    )  
}