import React, { useEffect, useState } from 'react'
import { createAccount, getAccount, updateAccount } from '../../services/EmployeeService'
import { useNavigate, useParams } from 'react-router-dom' 
import './Employee.css';
const EmployeeComponent = () => {
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [userName, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '',
    roleId: '',
    userName: '',
    password: '',
    phone 
  })
  
  const {accountId} = useParams();

  useEffect(() => {
    if(accountId){
      getAccount(accountId).then((response) => {
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setEmail(response.data.email);
        setRoleId(response.data.roleId);
        setUsername(response.data.userName);
        setPassword(response.data.password);
        setPhone(response.data.phone);
        setStatus(response.data.status);

      }).catch(error =>{
        console.error(error);
      })
    }
  },[accountId])
 
  const navigator = useNavigate();

  function handleFirstName(e) {
    setFirstName(e.target.value);
  }

  function handleLastName(e) {
    setLastName(e.target.value);
  }

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  function handleRoleId(e){
    setRoleId(e.target.value);
  }
  function handleUserName(e){
    setUsername(e.target.value);

  }
  function handlePassword(e){
    setPassword(e.target.value);

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
        createAt:new Date().toISOString() 
      };
      console.log(account);
      if(accountId){
        updateAccount(accountId, account).then ((response)=>{
          console.log(response.data)
          navigator('/accounts');

        }).catch(error =>{
          console.error(error)
        })
      }else{
        createAccount(account).then((response) => {
          console.log(response.data);
          navigator('/accounts');
        }).catch(error=>{
          console.error(error);
        })
      }
     
    }
  }

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (firstName.trim()) {
      errorsCopy.firstName = '';
    } else {
      errorsCopy.firstName = "First name is required.";
      valid = false;
    }

    if (lastName.trim()) {
      errorsCopy.lastName = '';
    } else {
      errorsCopy.lastName = "Last name is required.";
      valid = false;
    }

    if (email.trim()) {
      errorsCopy.email = '';
    } else {
      errorsCopy.email = "Email is required.";
      valid = false;
    }

    if (roleId.trim()) {
      errorsCopy.roleId = '';
    } else {
      errorsCopy.roleId = "RoleID is required.";
      valid = false;
    }

    if (email.trim()) {
      errorsCopy.userName = '';
    } else {
      errorsCopy.userName = "User Name is required.";
      valid = false;
    }

    if (email.trim()) {
      errorsCopy.password = '';
    } else {
      errorsCopy.password = "password is required.";
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  }

  function pageTitle() {
    if (accountId) {
      return <h2 className='text-center'> Update Employee </h2>
    } else {
      return <h2 className='text-center'> Add Employee </h2>
    }

  }

  
  return (
    <div className='container'>
      <br /> <br />
      <div className='row'>
        <div className='card col-md-6 offset-md-3 offset-md-3'>
          {
            pageTitle()
          }
          <div className='card-body'>
            <form>
              <div className='form-group mb-2'>
                <label className='form-label'>First Name</label>
                <input
                  type='text'
                  placeholder='Enter Employee First Name'
                  name='firstName'
                  value={firstName}
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  onChange={handleFirstName}
                />
                {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Last Name</label>
                <input
                  type='text'
                  placeholder='Enter Employee Last Name'
                  name='lastName'
                  value={lastName}
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  onChange={handleLastName}
                />
                {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Email</label>
                <input
                  type='email' 
                  placeholder='Enter Employee Email'
                  name='email'
                  value={email}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  onChange={handleEmail}
                />
                {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Role ID</label>
                <input
                  type='text'
                  placeholder='Enter Employee Role ID'
                  name='roleId'
                  value={roleId}
                  className={`form-control ${errors.roleId ? 'is-invalid' : ''}`}
                  onChange={handleRoleId}
                />
                {errors.roleId && <div className='invalid-feedback'>{errors.roleId}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>User Name</label>
                <input
                  type='password'
                  placeholder='Enter Employee User Name'
                  name='userName'
                  value={userName}
                  className={`form-control ${errors.userName ? 'is-invalid' : ''}`}
                  onChange={handleUserName}
                />
                {errors.userName && <div className='invalid-feedback'>{errors.userName}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Password</label>
                <input
                  type='password'
                  placeholder='Enter Employee password'
                  name='password'
                  value={password}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  onChange={handlePassword}
                />
                {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Phone Number</label>
                <input 
                 type="text"  
                  placeholder='Enter Employee phone number'
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  
                />
            </div>

            <div className='form-group mb-2'>
                <label className='form-label'>Status</label>
                <input 
                 type="text"  
                  placeholder='Set Status'
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)} 
                  required 
                  
                />
            </div>

              <button className='btn btn-success' onClick={saveOrUpdateAccount}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeComponent;
