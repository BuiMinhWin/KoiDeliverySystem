import React, { useEffect, useState } from 'react';
import {deleteAccount , listAccount } from '../../services/EmployeeService';
import { useNavigate } from 'react-router-dom';

const ListCustomerComponent = () => {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate()  ;

  useEffect(() => {
    getAllAccounts();
  }, []);

  const getAllAccounts = () => {
    listAccount()
      .then((response) => {
        if (Array.isArray(response.data)) {
          const customerAccounts = response.data.filter(account => account.roleId === 'Customer');
          setAccounts(customerAccounts);
        } else {
          console.error("API response is not an array", response.data);
          setAccounts([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching customer: ", error);
      });
  };

  const addNewAccount = () => {
    navigate('/add-account');
  };

  const updateAccount = (accountId) => {
    navigate(`/edit-account/${accountId}`);
  };

  const removeAccount = (accountId) => {  
    deleteAccount (accountId)
      .then(() => {
        getAllAccounts();
      })
      .catch((error) => {
        console.error("Error deleting employee: ", error);
      });
  };

  return (
    <div className="container">
      <h2 className="text-center">List of Customer</h2>
      <button className="btn btn-primary mb-2" onClick={addNewAccount}>Add Account</button>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Account Id</th>
            <th>RoleID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>CreateAt</th>
            <th>Province</th>
            <th>Avatar</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          i
          {accounts.length > 0 ? (
            accounts.map(account => (
              
             
             
              <tr key={account.accountId}>
                <td>{account.accountId}</td>
                <td>{account.roleId}</td>
                <td>{account.firstName}</td>
                <td>{account.lastName}</td>
                <td>{account.email}</td>
                <td>{account.createAt}</td>
                <td>{account.province}</td>
                <td><img src={account.avatar} alt="Avatar" width="50" height="50" /></td>
                <td>
                  <button className="btn btn-info" onClick={() => updateAccount(account.accountId)}>Update</button>
                  <button className="btn btn-danger" onClick={() => removeAccount(account.accountId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No Customer Found</td>
            </tr>
          )}
        
        </tbody>
      </table>
    </div>
  );
};

export default ListCustomerComponent;
