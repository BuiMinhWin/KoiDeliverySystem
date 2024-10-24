import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import avatar from "../../../assets/Avatar.jpg";
import logo from "../../../assets/Logo.png";
import "./Nguyen.module.css";

const HeaderBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sale-staff-container">
      <nav className="nguyen-navbar-order">
        <div className="nguyen-navbar-order-left">
          <img src={logo} className="nguyen-logo" alt="Logo" />
        </div>
        <div className="nguyen-navbar-order-right">
          <div className="nguyen-dropdown" onClick={toggleDropdown}>
            <img src={avatar} alt="Avatar" className="nguyen-avatar-order" />
            {isDropdownOpen && (
              <div className="nguyen-dropdown-content-avatar">
                <a href="#">Tài khoản của tôi</a>
                <a href="#">Đăng xuất</a>
              </div>
            )}
          </div>
        </div>
      </nav>

      <aside className="sidebar">
        <nav className="nav flex-column">
          <Link to="listsaleorder" className="nguyen-nav-link">
            View Orders
          </Link>
          <Link to="reports" className="nguyen-nav-link">
            View Reports
          </Link>
          <Link to="feedback" className="nguyen-nav-link">
            View Feedback
          </Link>
        </nav>
      </aside>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default HeaderBar;
