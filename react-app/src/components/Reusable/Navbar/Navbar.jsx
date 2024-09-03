import { Link } from "react-router-dom";
import "./Navbar.css";
import "../../../index.css";

export default function Navbar() {
  return (
    <div className="nav-container">
      <nav>
        <div className="nav-logo">LOGO</div>
        <div className="nav-anchors">
          <Link className="nav-anchor">
            <div className="icon-container">
              <img />
            </div>
            <p className="btn-text">Home</p>
          </Link>
          <Link className="nav-anchor">
            <div className="icon-container">
              <img />
            </div>
            <p className="btn-text">Work</p>
          </Link>
        </div>
      </nav>
    </div>
  );
}
