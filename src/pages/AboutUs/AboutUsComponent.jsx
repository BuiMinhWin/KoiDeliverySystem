// src/components/Homepage.jsx
import React, { useState, useEffect } from 'react';
import './AboutUs.css';
import FAQs from "../../components/FAQs/FAQs";
import logo from '../../assets/Logo.png';
import blog from '../../assets/Blog.jpg';
import { useNavigate } from 'react-router-dom';
import { getOrder } from '../../services/CustomerService';


const Homepage = () => {

  const [activeTab, setActiveTab] = useState('tracking'); // State để quản lý tab
  const [trackingCode, setTrackingCode] = useState(''); // State để quản lý mã đơn hàng
  const [trackingResult, setTrackingResult] = useState(null); // State cho kết quả theo dõi
  const navigate = useNavigate();

  const roleId = localStorage.getItem('roleId'); 
  console.log('Role ID:', roleId);
  // const accountId = localStorage.getItem('accountId');
  // console.log("Stored Account ID:", accountId);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
    if (activeTab !== 'tracking') {
      setTrackingCode(''); // Xóa mã đơn hàng
      setTrackingResult(null); // Xóa kết quả tra cứu
    }
  }, [activeTab]);


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
              <a href="/login">Tạo Đơn</a>
              <a href="#">Quy định vận chuyển</a>
              <a href="#">Chương trình khuyến mãi</a>
            </div>
          </div>
          <a href="#" className="nav-link">Giới Thiệu</a>
        </div>
        
        <div className="navbar-right">
        <a href="/Support" className="nav-link support-link">
            <i className="fas fa-question-circle"></i>Hỗ Trợ
          </a>
          {/* {!roleId ? ( */}
            <>
              <button className="register-btn" onClick={() => navigate('/register')}>Đăng Ký</button>
              <button className="login-btn" onClick={() => navigate('/login')}>Đăng Nhập</button>
            </>
          {/* ) : (
            <>
              {roleId === 'Manager' ? (
                <button onClick={() => navigate('/manager')}>Back</button>
              ) : roleId === 'Delivery' ? (
                <button onClick={() => navigate('/delivery')}>Back</button>
              ) : roleId === 'Sales' ? (
                <button onClick={() => navigate('/salestaff')}>Back</button>
              ) : roleId === 'Customer' ?(
                <button onClick={() => navigate('/customer')}>Back</button>
              ):null
              }
            </>
          )} */}
        
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
        <button className="order-btn" onClick={() => navigate('/login')}>TẠO ĐƠN TẠI ĐÂY</button>  
      </header>

      {/* Main content */}

      {/* Phần giới thiệu */}
      <div className="why-choose-section">
    <h2 className="why-choose-title">Tại sao nên chọn Koi Express cho những chú cá Koi của bạn?</h2>
    <div className="why-choose-content">
      <div className="content-item">
        <h3>Tận Tâm với Cá Koi của Bạn</h3>
        <p>Chăm sóc cá Koi của bạn là trách nhiệm của chúng tôi, 
          và chúng tôi luôn đặt phúc lợi của những chú cá lên hàng đầu. 
          An toàn cho cá Koi luôn là ưu tiên số một. Nhưng chúng tôi cũng quan tâm đến bạn. 
          Chúng tôi luôn sẵn sàng trả lời các câu hỏi,
           hỗ trợ mọi quyết định của bạn và đảm bảo bạn luôn cảm thấy thoải mái
           và tự tin khi sử dụng dịch vụ vận chuyển cá Koi của chúng tôi.</p>
      </div>
      <div className="content-item">
        <h3>Chuyên gia trong ngành vận chuyển</h3>
        <p>Vận chuyển cá Koi trong nước và quốc tế luôn thay đổi
           và đặc biệt phức tạp vào thời điểm hiện tại. Chúng tôi
            luôn cập nhật các quy định mới nhất, quy trình của hãng hàng không
             và các yêu cầu cụ thể của từng quốc gia để đảm bảo cá Koi của bạn
              đến nơi khỏe mạnh và an toàn.</p>
      </div>
      <div className="content-item">
        <h3>Tập ​​trung giải quyết vấn đề</h3>
        <p>Chúng tôi tìm giải pháp, không phải vấn đề.
           Dịch vụ vận chuyển cá Koi của chúng tôi toàn diện
            và phù hợp với mọi hành trình lớn nhỏ. Chúng tôi đã vận chuyển cá Koi đang mang trứng,
             xử lý các yêu cầu về giống loài đặc biệt, giải quyết các chuyến bay bị hủy và vượt qua 
             những khó khăn trong thời kỳ đại dịch toàn cầu. Với tinh thần "làm được, chắc chắn",
              chúng tôi hiểu rằng cá Koi của bạn là vô giá.</p>
      </div>
      <div className="content-item">
        <h3>Kiến Thức Chuyên Sâu</h3>
        <p>Dù là nắm bắt các quy trình thú y, 
          hiểu rõ yêu cầu cách ly của các quốc gia, 
          hay đảm bảo cá Koi có môi trường nước và oxy phù hợp trong suốt hành trình,
           chúng tôi có đầy đủ thông tin và kiến thức cần thiết. 
           Chúng tôi cam kết mang đến cho bạn trải nghiệm vận chuyển cá Koi thuận tiện,
            không rắc rối, đảm bảo cá của bạn được vận chuyển đến tận nơi an toàn và khỏe mạnh.</p>
      </div>
    </div>
    </div>

    {/* Phần giới thiệu về blog */}
    <div className="blog-intro-section-Koi">
      <div className="blog-content">
        <h2 className="blog-title">Những gì chúng tôi đề cập trong Blog</h2>
        <p className="blog-description">
        Toàn bộ đội ngũ của chúng tôi đều là những người yêu thích cá Koi
        và là chuyên gia trong lĩnh vực vận chuyển cá Koi. 
        Khi chúng tôi nói rằng chúng tôi sống và hít thở công việc vận chuyển cá Koi 
        , chúng tôi hoàn toàn nghiêm túc.
        Trên blog của chúng tôi, chúng tôi chia sẻ 
        thông tin về các yêu cầu vận chuyển cá Koi,
        cách giữ cho cá Koi của bạn khỏe mạnh và hạnh phúc trong suốt quá trình vận chuyển,
        cũng như nhiều điều thú vị khác liên quan. Hãy cùng khám phá!
        </p>
        <button className="blog-btn" onClick={() => navigate('/blog')}>Thông tin về Blog</button>
      </div>
      <div className="blog-image-Koi">
      <img src={blog} className="img" alt="Blog" />
      </div>
    </div>

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