import { Link } from "react-router-dom";
import "./Navbar.css";
import "../../../index.css";

export default function Navbar() {
  return (
    <nav>
      <div className="nav-logo">LOGO</div>
      <div className="nav-anchors">
        <Link className="nav-anchor" to="/home">
          <div className="icon-container">
            <img />
          </div>
          <p className="btn-text">Home</p>
        </Link>
        <Link className="nav-anchor" to="/work">
          <div className="icon-container">
            <img />
          </div>
          <p className="btn-text">Work</p>
        </Link>
        <Link className="nav-anchor">
          <div className="icon-container">
            <img />
          </div>
          <p className="btn-text">Cards</p>
        </Link>
        <Link className="nav-anchor">
          <div className="icon-container">
            <img />
          </div>
          <p className="btn-text">Budget</p>
        </Link>
        <Link className="nav-anchor">
          <div className="icon-container">
            <img />
          </div>
          <p className="btn-text">Settings</p>
        </Link>
      </div>
    </nav>
  );
}
