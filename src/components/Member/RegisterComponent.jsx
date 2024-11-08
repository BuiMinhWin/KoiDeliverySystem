import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { createAccount } from '../../services/EmployeeService';
import { useSnackbar } from 'notistack';

const RegisterComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
 
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  

const handleSubmit = (e) => {
  e.preventDefault();

  if (password.length < 8 || !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password)) {
    enqueueSnackbar('Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.', { variant: 'error', autoHideDuration: 1000 });
    return;
  }

  if (!/^0\d{9}$/.test(phone)) {
    enqueueSnackbar('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.', { variant: 'error', autoHideDuration: 1000 });
    return;
  }

  if (password !== confirmPassword) {
    enqueueSnackbar('Mật khẩu không khớp', { variant: 'error', autoHideDuration: 1000 });
    return;
  }

  const account = { 
    firstName, 
    lastName, 
    userName, 
    password, 
    email, 
    phone, 
    roleId: 'Customer', 
    createAt: new Date().toISOString() 
  };

  createAccount(account)
    .then((response) => {
      const successMessage = response?.data?.message || 'Tạo tài khoản thành công!';
      enqueueSnackbar(successMessage, { variant: 'success', autoHideDuration: 1000 });
      navigate('/login');
    })
    .catch((error) => {
      const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!';
      enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 1000 });
    });
};

  return (
    <div className="background-section">
      <div className="register-container">
        <div className="background-giphy"></div>
        <div className="register-form-container">
          <div className="register-form-box">
            <h2>Tạo tài</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="left-column">
                <div className="input-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)}  
                    required 
                    placeholder="Username"
                  />
                </div>
                <div className="input-group">
                  <label>Mật khẩu</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="Enter password"
                  />
                </div>
                <div className="input-group">
                  <label>Xác nhận mật khẩu</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    placeholder="Confirm password"
                  />
                </div> 
                <div className="input-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="Email"
                  />
                </div>
                <button type="submit" className="submit-btn">Đăng Kí</button>
              </div>

              <div className="right-column">
                <div className="input-group">
                  <label>Họ </label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                    placeholder="Your First Name"
                  />
                </div>
                <div className="input-group">
                  <label>Tên</label> 
                  <input 
                    type="text"  
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                    placeholder="Your Last Name"
                  />
                </div>
                <div className="input-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    placeholder="Phone Number"
                  />
                </div>
               
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
