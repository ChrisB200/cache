import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import "../index.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>CACHE</div>
      <div className={styles.anchors}>
        <Link className={styles.anchor} to="/home">
          <div className={styles.iconContainer}>
            <img />
          </div>
          <p className="btn-text">Home</p>
        </Link>
        <Link className={styles.anchor} to="/work">
          <div className="icon-container">
            <img />
          </div>
          <p className="btn-text">Work</p>
        </Link>
        <Link className={styles.anchor}>
          <div className="icon-container">
            <img />
          </div>
          <p className="btn-text">Cards</p>
        </Link>
        <Link className={styles.anchor}>
          <div className="icon-container">
            <img />
          </div>
          <p className="btn-text">Budget</p>
        </Link>
        <Link className={styles.anchor}>
          <div className="icon-container">
            <img />
          </div>
          <p className="btn-text">Settings</p>
        </Link>
      </div>
    </nav>
  );
}
