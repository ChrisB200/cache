import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import "../index.css";
import { useFont } from "../hooks/contexts";
import ClickableIcon from "../components/ClickableIcon";
import menu from "../assets/icons/menu-burger.png";

export default function Navbar({ isNavbarOpen, toggleNavbar }) {
  const { increaseFontSize, decreaseFontSize, resetFontSize } = useFont();

  return (
    <div className={styles.container}>
      <ClickableIcon
        className={`${styles.icon} ${isNavbarOpen ? styles.hide : styles.show}`}
        icon={menu}
        onClick={toggleNavbar}
      />

      <nav className={`${isNavbarOpen ? styles.expanded : styles.collapsed}`}>
        {isNavbarOpen ? (
          <>
            <div className={styles.nav}>
              <div className={styles.logo}>CACHE</div>
              <div className={styles.anchors}>
                <Link className={styles.anchor} to="/home">
                  <div className={styles.iconContainer}></div>
                  <p className="btn-text">Home</p>
                </Link>
                <Link className={styles.anchor} to="/work">
                  <div className={styles.iconContainer}></div>
                  <p className="btn-text">Work</p>
                </Link>
                <Link className={styles.anchor} to="/cards">
                  <div className={styles.iconContainer}></div>
                  <p className="btn-text">Cards</p>
                </Link>
                <Link className={styles.anchor} to="/budget">
                  <div className={styles.iconContainer}></div>
                  <p className="btn-text">Budget</p>
                </Link>
                <Link className={styles.anchor} to="/settings">
                  <div className={styles.iconContainer}></div>
                  <p className="btn-text">Settings</p>
                </Link>
              </div>
              <div className={styles.controls}>
                <button onClick={decreaseFontSize}>A-</button>
                <button onClick={resetFontSize}>R</button>
                <button onClick={increaseFontSize}>A+</button>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </nav>
    </div>
  );
}
