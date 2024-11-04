// src/components/Homepage.jsx
import React, { useState, useEffect } from 'react';
import './Support.css';
import FAQs from "../../components/FAQs/FAQs";
import logo from '../../assets/Logo.png';
import blog from '../../assets/Blog.jpg';
import { useNavigate } from 'react-router-dom';
import { getOrder,getAvatar } from '../../services/CustomerService';
import { logout } from '../../components/Member/auth'; 

const Homepage = () => {

  const [activeTab, setActiveTab] = useState('tracking'); // State để quản lý tab
  const [trackingCode, setTrackingCode] = useState(''); // State để quản lý mã đơn hàng
  const [trackingResult, setTrackingResult] = useState(null); // State cho kết quả theo dõi
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null); 

  const roleId = localStorage.getItem('roleId'); 
  console.log('Role ID:', roleId);
  const accountId = localStorage.getItem('accountId');
  console.log("Stored Account ID:", accountId);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };


  const handleTrackingSubmit = () => {
    if (trackingCode) {
      getOrder(trackingCode)
        .then((response) => {
          setTrackingResult(response.data); // Lưu thông tin đơn hàng vào trackingResult
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          setTrackingResult([]); // Nếu không tìm thấy đơn hàng
        });
    }
  };

  useEffect(() => {
    if (activeTab !== "tracking") {
      setTrackingCode(""); // Xóa mã đơn hàng
      setTrackingResult(null); // Xóa kết quả tra cứu
    }

    const fetchAccount = async () => {
      try {
       
        const avatarUrl = await getAvatar(accountId);
        setAvatar(avatarUrl);
        // console.log(avatarUrl); 
      } catch (error) {
        console.error("Error fetching account data:", error);
      } 
    };
    if (accountId) fetchAccount();

  }, [activeTab,accountId]);

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
              <a href="/form">Tạo Đơn</a>
              <a href="#">Quy định vận chuyển</a>
              <a href="#">Chương trình khuyến mãi</a>
            </div>
          </div>
          <a href="/AboutUs" className="nav-link">Giới Thiệu</a>
        </div>
        
        <div className="navbar-right">
        <a href="/Support" className="nav-link support-link">
            <i className="fas fa-question-circle"></i>Hỗ Trợ
          </a>
          {!roleId ? ( 
            <>
              <button className="register-btn" onClick={() => navigate('/register')}>Đăng Ký</button>
              <button className="login-btn" onClick={() => navigate('/login')}>Đăng Nhập</button>
            </>
           ) : (
            <>
            <div className="dropdown">
            <img src={avatar || '/default-avatar.png'} alt="Avatar" className="avatar" />
              <div className="dropdown-content-avatar ">
                <a href="user-page">Tài khoản của tôi</a>
                <a  onClick={handleLogout}>Đăng xuất</a>
              </div>  
            </div>
            </>
          )} 
        
      </div>

        {/* <div className="navbar-right">
          <a href="#" className="nav-link support-link"><i className="fas fa-question-circle"></i>Hỗ Trợ</a>
          <button className="register-btn" onClick={() => navigate('/register')}>Đăng Ký</button>
          <button className="login-btn" onClick={() => navigate('/login')}>Đăng Nhập</button>  
        </div> */}
              
        
      </nav>

      {/* Welcome section */}
      <header className="homepage-header">
        <h1 className='title-1'>VẬN CHUYỂN CÁ KOI</h1>
        <h1 className='title-2'>GẦN GŨI - TIN CẬY - HIỆU QUẢ</h1>
        <button className="order-btn" onClick={() => navigate('/form')}>TẠO ĐƠN TẠI ĐÂY</button>  
      </header>


    {/* Phần Vận Chuyển Cá Koi An Toàn, Đến Đích Bình Yên */}
    <div className="transport-section">
      <h2 className="transport-title">Vận Chuyển Cá Koi An Toàn, Đến Đích Bình Yên</h2>
      <p className="transport-description">
        Việc vận chuyển những chú cá Koi yêu quý của bạn có thể là một trải nghiệm đầy sự lo lắng và hồi hộp, 
        đặc biệt khi mỗi địa phương có những quy định và yêu cầu riêng. Chúng tôi chuyên vận chuyển cá Koi trong nước và Nhật Bản. 
        Dù cá Koi của bạn cần đến đâu, từ Hà Nội đến Hồ Chí Minh hay từ những ao hồ nổi tiếng ở Nhật Bản, 
        chúng tôi luôn đảm bảo quá trình vận chuyển diễn ra suôn sẻ và thuận tiện cho bạn, cũng như cho những chú cá Koi của bạn.
      </p>
      <div className="service-options">
        <div>Vận Chuyển Trong Nước</div>
        <div>Vận Chuyển Quốc Tế</div>
    </div>
    </div>

    <div>
      <FAQs />
    </div>

    {/* The end section */}
    <header className="order-header">
        <h1>Bắt đầu tạo đơn với Koi Express</h1>
        <button className="order-btn-end" onClick={() => navigate('/login')}>TẠO ĐƠN TẠI ĐÂY</button>  
      </header>

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
          <a href="#">Theo Dõi Đơn Hàng</a><br />
          {/* <a href="#">Ước Tính Chi Phí</a><br />
          <a href="/login">Tạo đơn hàng</a><br /> */}
          <a href="#">Quy định vận chuyển</a><br />
          <a href="#">Chương trình khuyến mãi</a>
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
}


export default Homepage;