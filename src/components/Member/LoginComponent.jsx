import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';
import { loginAccount, googleLogin } from '../../services/EmployeeService';  
import * as jwtJsDecode from 'jwt-js-decode';
import { useSnackbar } from 'notistack';

const LoginComponent = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { userName, password };

    try {
      const response = await loginAccount(loginData);
      console.log("API Response:", response);
      
      const result = response.data;
      localStorage.setItem('roleId', result.roleId);
      localStorage.setItem('accountId', result.accountId);
      localStorage.setItem('province', result.province);

      enqueueSnackbar('Login successful', { variant: 'success' });

      if (result.roleId === 'Manager') {
        navigate('/manager');
      } else if (result.roleId === 'Delivery') {
        navigate('/delivery');
      } else if (result.roleId === 'Customer') {
        navigate('/customer');
      } else if (result.roleId === 'Sales') {
        navigate('/salestaff');
      }
    } catch (error) {
      console.error('Login Error:', error);
      enqueueSnackbar('Login failed. Please try again.', { variant: 'error',autoHideDuration: 1000 });
    }
  };

  const handleGoogleLoginSuccess = (response) => {
    const credential = response.credential;
    if (!credential) {
      enqueueSnackbar('Google login failed. No credential found.', { variant: 'error',autoHideDuration: 1000 });
      return;
    }

    const decodedToken = jwtJsDecode.decode(credential);
    const { payload } = decodedToken;
    const { given_name: firstName, family_name: lastName, email, picture: avatar } = payload;

    let createAt = localStorage.getItem('createAt');
    const account = {
      firstName,
      lastName,
      userName,
      password,
      email,
      phone,
      roleId: "Customer",
      avatar,
      createAt
    };

    googleLogin(account)
      .then((response) => {
        const result = response.data;
        
        if (!createAt) {
          createAt = result.createAt || new Date().toISOString();
          localStorage.setItem('createAt', createAt);
        }
        
        localStorage.setItem('roleId', result.roleId);
        
        if (result.roleId === 'Customer') {
          enqueueSnackbar('Google login successful', { variant: 'success',autoHideDuration: 1000  });
          navigate('/customer');
        } else {
          enqueueSnackbar('Unexpected roleId. Please try again.', { variant: 'warning',autoHideDuration: 1000  });
        }
      })
      .catch((err) => {
        console.error('Error during Google login:', err);
        enqueueSnackbar('An error occurred during Google login', { variant: 'error' ,autoHideDuration: 1000 });
      });
  };

  const handleGoogleLoginFailure = (response) => {
    // console.error('Google login failure:', response);
    enqueueSnackbar('Google login failed, please try again.', { variant: 'error',autoHideDuration: 1000 , response });
  };

  return (
    <div className="login-container">
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
            <form onSubmit={handleSubmit}>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Email or phone number"
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
              </div>
              <div className="options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="/reset">Forgot password?</a>
              </div>
              <button type="submit">Sign In</button>
            </form>

            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />

            <div className="sign-up">
              Don't have an account? <a href="/register">Sign up now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
