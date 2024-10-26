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
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords do not match!', { variant: 'error', autoHideDuration: 1000 });
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
      avatar, 
      createAt: new Date().toISOString() 
    };
  
    createAccount(account)
      .then((response) => {
        console.log('Account created:', response.data.message);
        enqueueSnackbar('Register success.', { variant: 'success', autoHideDuration: 1000 });
        navigate('/login');
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message ;
        enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 1000 });
      });
  };

  return (
    <div className="background-section">
      <div className="register-container">
        <div className="background-giphy"></div>
        <div className="register-form-container">
          <div className="register-form-box">
            <h2>Create Your Account</h2>
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
                  <label>Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="Enter password"
                  />
                </div>
                <div className="input-group">
                  <label>Confirm Password</label>
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
                <button type="submit" className="submit-btn">Sign Up</button>
              </div>

              <div className="right-column">
                <div className="input-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                    placeholder="Your First Name"
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label> 
                  <input 
                    type="text"  
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                    placeholder="Your Last Name"
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    placeholder="Phone Number"
                  />
                </div>
                {/* <div className="input-group">
                  <label>Gender</label>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)} 
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div> */}
                {/* <button type="button" className="google-login">Sign Up with Google</button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
