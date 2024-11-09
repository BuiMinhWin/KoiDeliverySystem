// src/components/ShippingPolicy.jsx
import React from 'react';
import './ShippingPolicy.css';
import logo from '../../assets/Logo.png';
import { useNavigate } from 'react-router-dom';

const ShippingPolicy = () => {
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
      <header className="shipping-policy-header">
        <h1>Quy Định Vận Chuyển</h1>
      </header>

      <section className="policy-section">
        <h2>1. Quy Định Vận Chuyển</h2>
        <p>
          Để đảm bảo quá trình vận chuyển an toàn và hiệu quả, chúng tôi áp dụng quy định về tính phí vận chuyển dựa trên
          khoảng cách. Phí vận chuyển sẽ thay đổi tùy vào khoảng cách giữa điểm gửi và điểm nhận như sau:
        </p>

        <h2>2. Cách Tính Phí Vận Chuyển</h2>
        <p>Công thức tính giá dựa trên khoảng cách:</p>
        <ul>
          <li><strong>Dưới 10km:</strong> Phí vận chuyển tính theo khoảng cách × hệ số phí.</li>
          <li><strong>10-50km:</strong> Phí vận chuyển = (khoảng cách × hệ số phí) × 0.2.</li>
          <li><strong>50-100km:</strong> Phí vận chuyển = (khoảng cách × hệ số phí × 1.2) / 10.</li>
          <li><strong>100-500km:</strong> Phí vận chuyển = (khoảng cách × hệ số phí × 1.4) / 10.</li>
          <li><strong>Trên 500km:</strong> Phí vận chuyển = (khoảng cách × hệ số phí × 1.7) / 10.</li>
        </ul>

        <h2>3. Ví Dụ Tính Phí</h2>
        <p>Ví dụ, với hệ số phí cơ bản là 10, phí vận chuyển sẽ được tính như sau:</p>
        <ul>
          <li>Khoảng cách 5 km: <code>5 × 10 = 50</code></li>
          <li>Khoảng cách 30 km: <code>30 × 10 × 0.2 = 60</code></li>
          <li>Khoảng cách 80 km: <code>(80 × 10 × 1.2) / 10 = 96</code></li>
          <li>Khoảng cách 200 km: <code>(200 × 10 × 1.4) / 10 = 280</code></li>
          <li>Khoảng cách 600 km: <code>(600 × 10 × 1.7) / 10 = 1020</code></li>
        </ul>
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
            <a href="/Policy">Quy định vận chuyển</a><br />
            <a href="/Promotion">Chương trình khuyến mãi</a>
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

export default ShippingPolicy;
