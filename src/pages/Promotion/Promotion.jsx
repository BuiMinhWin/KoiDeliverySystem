// src/components/Promotion.jsx
import React from 'react';
import './Promotion.css';
import logo from '../../assets/Logo.png';
import { useNavigate } from 'react-router-dom';

const Promotion = () => {
  const navigate = useNavigate();
  const roleId = localStorage.getItem('roleId');

  const handleCreateOrderClick = (event) => {
    event.preventDefault();
    if (roleId) {
      navigate('/form');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('roleId');
    navigate("/login");
  };

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} className="logo" alt="Logo" />
          <a className="nav-link" onClick={() => navigate('/')}>Trang Chủ</a>

          {/* Dropdown Dịch Vụ */}
          <div className="dropdown">
            <a href="#" className="nav-link">Dịch Vụ</a>
            <div className="dropdown-content">
              <a href="#" onClick={handleCreateOrderClick}>Tạo Đơn</a>
              <a href="/Policy">Quy định vận chuyển</a>
              <a href="/Promotion">Chương trình khuyến mãi</a>
            </div>
          </div>
          <a href="/AboutUs" className="nav-link">Giới Thiệu</a>
        </div>

        <div className="navbar-right">
          <a href="/Support" className="nav-link support-link">
            <i className="fas fa-question-circle"></i> Hỗ Trợ
          </a>
          {!roleId ? (
            <>
              <button className="register-btn" onClick={() => navigate('/register')}>Đăng Ký</button>
              <button className="login-btn" onClick={() => navigate('/login')}>Đăng Nhập</button>
            </>
          ) : (
            <>
              <div className="dropdown">
                <img src={'/default-avatar.png'} alt="Avatar" className="avatar" />
                <div className="dropdown-content-avatar">
                  <a href="/user-page">Tài khoản của tôi</a>
                  <a onClick={handleLogout}>Đăng xuất</a>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <header className="promotion-header">
        <h1>Chương Trình Khuyến Mãi</h1>
      </header>

      <section className="promotion-section">
        <h2>Mã Giảm Giá 10%: 10PKL</h2>
        <p>
          Chúng tôi xin giới thiệu mã giảm giá <strong>10PKL</strong>, một ưu đãi đặc biệt cho những khách hàng
          đặt cá Koi có trọng lượng trên 5kg. Với mã này, bạn sẽ được giảm ngay <strong>10%</strong> giá trị đơn hàng.
        </p>

        <h3>Điều Kiện Áp Dụng</h3>
        <ul>
          <li>Sử dụng mã giảm giá <strong>10PKL</strong> tại bước thanh toán.</li>
          <li>Chỉ áp dụng cho các đơn hàng cá Koi có tổng trọng lượng từ 5kg trở lên.</li>
          <li>Khuyến mãi không áp dụng đồng thời với các ưu đãi khác.</li>
        </ul>

        <h3>Hướng Dẫn Sử Dụng Mã</h3>
        <p>Trong quá trình thanh toán, hãy nhập mã <strong>10PKL</strong> vào ô mã giảm giá để được áp dụng chiết khấu 10%.</p>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-contact">
          <p>Liên hệ:</p>
        </div>
        <div className="footer-number">
          <p>0123-456-789</p>
        </div>
        <div className="footer-email">
          <p>tpthaonguyen04@gmail.com</p>
        </div>

        <hr className="footer-divider" />
        <div className="footer-columns">
          {/* Cột 1: Logo và địa chỉ */}
          <div className="footer-column">
            <img src={logo} className="footer-logo" alt="Logo" />
            <h3>THÔNG TIN</h3>
            <p>Địa chỉ: Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh</p>
          </div>

          {/* Cột 2: Dịch vụ */}
          <div className="footer-column">
            <h4>Dịch Vụ</h4>
            <a href="#" onClick={handleCreateOrderClick}>Tạo Đơn</a><br />
            <a href="/shipping-policy">Quy định vận chuyển</a><br />
            <a href="/promotion">Chương trình khuyến mãi</a>
          </div>

          {/* Cột 3: Giới Thiệu */}
          <div className="footer-column">
            <a className="footer-link" href="/AboutUs">Giới Thiệu</a>
          </div>

          {/* Cột 4: Hỗ Trợ */}
          <div className="footer-column">
            <a className="footer-link" href="/Support">Hỗ Trợ</a>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Chính sách bảo mật, copyright và điều khoản sử dụng */}
        <div className="footer-bottom">
          <p>Chính Sách Bảo Mật | Điều Khoản Sử Dụng</p>
          <p>© 2024 Koi Express. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Promotion;
