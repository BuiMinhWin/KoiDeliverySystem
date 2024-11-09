import React, { useEffect, useState } from 'react';
import { createAccount, getAccount, updateAccount } from '../../services/EmployeeService';
import { useNavigate, useParams } from 'react-router-dom';
import './Employee.css';

const EmployeeComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roleId: '',
    userName: '',
    password: '',
    phone: ''
  });

  const { accountId } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    if (accountId) {
      getAccount(accountId)
        .then((response) => {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setEmail(response.data.email);
          setRoleId(response.data.roleId);
          setUsername(response.data.userName);
          setPassword(response.data.password);
          setPhone(response.data.phone);
          setStatus(response.data.status);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [accountId]);

  function handleFirstName(e) {
    setFirstName(e.target.value);
  }

  function handleLastName(e) {
    setLastName(e.target.value);
  }

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  function handleRoleId(e) {
    setRoleId(e.target.value);
  }

  function handleUserName(e) {
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function handlePhone(e) {
    setPhone(e.target.value);
  }

  function saveOrUpdateAccount(e) {
    e.preventDefault();

    if (validateForm()) {
      const account = {
        firstName,
        lastName,
        userName,
        password,
        email,
        phone,
        roleId,
        createAt: new Date().toISOString()
      };
      if (accountId) {
        updateAccount(accountId, account)
          .then((response) => {
            navigator('/accounts');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        createAccount(account)
          .then((response) => {
            navigator('/accounts');
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (firstName.trim()) {
      errorsCopy.firstName = '';
    } else {
      errorsCopy.firstName = 'First name is required.';
      valid = false;
    }

    if (lastName.trim()) {
      errorsCopy.lastName = '';
    } else {
      errorsCopy.lastName = 'Last name is required.';
      valid = false;
    }

    if (email.trim()) {
      errorsCopy.email = '';
    } else {
      errorsCopy.email = 'Email is required.';
      valid = false;
    }

    if (roleId.trim()) {
      errorsCopy.roleId = '';
    } else {
      errorsCopy.roleId = 'RoleID is required.';
      valid = false;
    }

    if (userName.trim()) {
      errorsCopy.userName = '';
    } else {
      errorsCopy.userName = 'User Name is required.';
      valid = false;
    }

    if (password.trim()) {
      errorsCopy.password = '';
    } else {
      errorsCopy.password = 'Password is required.';
      valid = false;
    }

    if (phone.trim()) {
      errorsCopy.phone = '';
    } else {
      errorsCopy.phone = 'Phone number is required.';
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  }

  return (
    <div className='container1'>
      <div className='form-container col-md-4 offset-md-4'>
        <h2 className='text-center'>{accountId ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}</h2>
        <form onSubmit={saveOrUpdateAccount}>
          <div>
            <input
              type='text'
              placeholder='First Name'
              value={firstName}
              onChange={handleFirstName}
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.firstName}</div>
          </div>
          <div>
            <input
              type='text'
              placeholder='Last Name'
              value={lastName}
              onChange={handleLastName}
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.lastName}</div>
          </div>
          <div>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={handleEmail}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.email}</div>
          </div>
          <div>
            
            <select
              value={roleId}
              onChange={handleRoleId}
              className={`form-control ${errors.roleId ? 'is-invalid' : ''}`}
            >
              <option value="">RoleId</option>
              <option value="sales">Sales</option>
              <option value="delivery">Delivery</option>
            </select>
            <div className='invalid-feedback'>{errors.roleId}</div>
          </div>
          <div>
            <input
              type='text'
              placeholder='User Name'
              value={userName}
              onChange={handleUserName}
              className={`form-control ${errors.userName ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.userName}</div>
          </div>
          <div>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={handlePassword}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.password}</div>
          </div>
          <div>
            <input
              type='text'
              placeholder='Phone'
              value={phone}
              onChange={handlePhone}
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.phone}</div>
          </div>
          <button type='submit' className='btn btn-primary'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeComponent;
