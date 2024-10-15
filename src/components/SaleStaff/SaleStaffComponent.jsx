import React, { useState } from 'react'; // Thêm useState
import { Link, Outlet } from 'react-router-dom';
import logo from '../../assets/Logo.png';
import avatar from '../../assets/Avatar.jpg';
import './SaleStaff.css';

const SaleStaffComponent = () => {

  const [isDropdownOpen, setDropdownOpen] = useState(false); // Quản lý trạng thái mở dropdown

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  }

  return (
    <div className="sale-staff-container">

      <nav className="navbar-cus">
        <div className="navbar-cus-left">
          <img src={logo} className="logo" alt="Logo" />
        </div>
        <div className="navbar-cus-right">
          <div className="dropdown" onClick={toggleDropdown}>
            <img src={avatar} alt="Avatar" className="avatar" />
            {isDropdownOpen && ( // Hiển thị dropdown nếu isDropdownOpen là true
              <div className="dropdown-content">
                <a href="#">Tài khoản của tôi</a>
                <a href="#">Đăng xuất</a>
              </div>
            )}
          </div>
        </div>
      </nav>

      <aside className="sidebar">
        <nav className="nav flex-column">
          <Link to="listsaleorder" className="nav-link">View Orders</Link>
          <Link to="reports" className="nav-link">View Reports</Link>
          <Link to="feedback" className="nav-link">View Feedback</Link>
        </nav>
      </aside>

      <div className="content">
        <Outlet /> {/* Nơi hiển thị các route con */}
      </div>

    </div>
  );
};

export default SaleStaffComponent;
