import React, { useState } from 'react';
import { forgotPassword, verifyPassword } from '../../services/EmployeeService';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import './Reset.css';

const ResetPasswordComponent = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false); // Trạng thái để ẩn/hiện các trường nhập mật khẩu và code
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [time, setTime] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (time) {
      enqueueSnackbar('Vui lòng chờ 5 giây trước khi gửi lại email.', { variant: 'warning', autoHideDuration: 1000 });
      return;
    }
    try {
      // console.log(email);
      const response = await forgotPassword(email); 
      console.log(response.data);
      const errorMessage = "Code để tạo lại mật khẩu đã được gửi đến email của bạn" ;
        enqueueSnackbar(errorMessage, { variant: 'success', autoHideDuration: 1000 });
      

      if (response.data) {
        setShowPasswordFields(true);
      }
      setTime(true);
      setTimeout(() => setTime(false), 5000); // Hết chờ sau 5 giây

    } catch (error) {
    
      alert(error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await verifyPassword(email, code, newPassword, confirmPassword);
  
      if (response?.data?.message) {
        enqueueSnackbar(response.data.message, { variant: 'success', autoHideDuration: 1000 });
      }
  
      if (newPassword !== confirmPassword) {
        enqueueSnackbar('Mật khẩu không khớp!', { variant: 'error', autoHideDuration: 1000 });
      } else {
        enqueueSnackbar('Tạo mật khẩu mới thành công!', { variant: 'success', autoHideDuration: 1000 });
        navigate('/login');
      }
    } catch (error) {

      const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!';
      enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 1000 });
    }
  };

  return (
    <div className='reset-password-container'>
      <div className='reset-main-content'>
        <div className="reset-image-container"></div>
        <div className="reset-form-container">
          <div className="reset-form-box">
            <div className="reset-logo-title">
              <img src="/Logo-Koi/Order.png" alt="Koi Logo" className="reset-koi-logo" />
              <div className="reset-text-container">
                <h2>Koi Delivery</h2>
                <p>Nice to see you again</p>
              </div>
            </div>

          
            {!showPasswordFields && (
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter email"
                  />
                </div>

                <button type="submit" disabled={time}>
                  {time ? 'Chờ 5 giây...' : 'Gửi để nhận code'}
                </button>
              </form>
            )}

           
            {showPasswordFields && (
              <form onSubmit={handlePasswordSubmit}>

                <div>
                  <label>Email</label>
                  <input
                    type="text"
                    // value={email}
                    // // onChange={(e) => setEmail(e.target.value)}

                    placeholder={email}
                  />
                </div>
                <div>
                  <label> Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="Enter code"
                  />
                </div>
                <div>
                  <label> Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="New password"
                  />
                </div>
                <div>
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm password"
                  />
                </div>

                <button type="submit">Tạo mật khẩu mới </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
