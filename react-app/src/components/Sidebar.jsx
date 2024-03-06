import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import pie from '../assets/pie.png'
import banking from '../assets/banking.png'
import budget from '../assets/budget.png'
import settings from '../assets/settings.png'
import wallet from '../assets/wallet.png'
import work from '../assets/work.png'
import './Sidebar.css'
import '../index.css'

function Sidebar() {
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} />
        </div>
        <div className="sidebar-anchors">
          <Link className="sidebar-anchor" to="/overview">
            <div className="sidebar-anchor-img-container">
              <img src={pie} />
            </div>
            <p>Overview</p>
          </Link>
          <Link className="sidebar-anchor" to="/banking">
            <div className="sidebar-anchor-img-container">
              <img src={banking} />
            </div>
            <p>Banking</p>
          </Link>
          <Link className="sidebar-anchor" to="/budget">
            <div className="sidebar-anchor-img-container">
              <img src={budget} />
            </div>
            <p>Budget</p>
          </Link>
          <Link className="sidebar-anchor" to="/pockets">
            <div className="sidebar-anchor-img-container">
              <img src={wallet} />
            </div>
            <p>Pockets</p>
          </Link>
          <Link className="sidebar-anchor" to="/work">
            <div className="sidebar-anchor-img-container">
              <img src={work} />
            </div>
            <p>Work</p>
          </Link>
          <Link className="sidebar-anchor" to="/preferences">
            <div className="sidebar-anchor-img-container">
              <img src={settings} />
            </div>
            <p>Preferences</p>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Sidebar