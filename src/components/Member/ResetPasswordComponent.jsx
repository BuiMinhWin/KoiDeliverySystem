import React, { useState } from 'react';
import { forgotPassword, verifyPassword } from '../../services/EmployeeService';
// import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ResetPasswordComponent = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false); // Trạng thái để ẩn/hiện các trường nhập mật khẩu và code
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(email);
      const response = await forgotPassword(email); 
      console.log(response.data);

      // Nếu nhận được phản hồi hợp lệ, ẩn nút submit và hiển thị form nhập code và mật khẩu mới
      if (response.data) {
        setShowPasswordFields(true);
      }

    } catch (error) {
      console.log('Fail', error);
      alert('An error occurred during reset');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const response = await verifyPassword(email, code, newPassword, confirmPassword); 
    console.log(response.data);
    
    if (newPassword !== confirmPassword) {
      console.log('Passwords do not match');
    } else {
      console.log('Password reset successful');
      navigate('/login');
    }
  };

  return (
    <div className='password-container'>
      <div className='main-content'>
        <div className="login-image-container"></div>
        <div className="login-form-container">
          <div className="login-form-box">
            <div className="logo-title">
              <img src="/Logo-Koi/Order.png" alt="Koi Logo" className="koi-logo" />
              <div className="text-container">
                <h2>Koi Delivery</h2>
                <p>Nice to see you again</p>
              </div>
            </div>

            {/* Form nhập email */}
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

                <button type="submit">Submit</button>
              </form>
            )}

            {/* Các trường này sẽ chỉ hiển thị khi showPasswordFields = true */}
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

                <button type="submit">Reset Password</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
