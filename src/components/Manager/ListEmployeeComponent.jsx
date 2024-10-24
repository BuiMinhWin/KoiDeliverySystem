import React, { useEffect, useState } from 'react';
import { deleteAccount, listAccount } from '../../services/EmployeeService';
import { useNavigate } from 'react-router-dom';
import './ListEmployee.css';
import { FaSearch } from "react-icons/fa";

const ListEmployeeComponent = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllAccounts();
  }, []);

  const getAllAccounts = () => {
    listAccount()
      .then((response) => {
        if (Array.isArray(response.data)) {
          const employeeAccounts = response.data.filter(account => (account.roleId !== 'Customer' && account.roleId !== 'Manager'));
          setAccounts(employeeAccounts);
        } else {
          console.error("API response is not an array", response.data);
          setAccounts([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching employees: ", error);
      });
  };

  const addNewAccount = () => {
    navigate('/add-account');
  };

  const updateAccount = (accountId) => {
    navigate(`/edit-account/${accountId}`);
  };

  const removeAccount = (accountId) => {
    deleteAccount(accountId)
      .then(() => {
        getAllAccounts();
      })
      .catch((error) => {
        console.error("Error deleting employee: ", error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAccounts = accounts.filter(
    account => 
      account.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="text-center">List of Accounts</h2>
      <div className="d-flex align-items-center mb-3">
        <button className="add-btn" onClick={addNewAccount}>
          Add Account
        </button>
        <div className="search-bar ml-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="search-icon">
            <FaSearch />
          </span>
        </div>
    </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Account Id</th>
            <th>RoleID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>CreateAt</th>
            {/* <th>Avatar</th> */}
            <th>Province</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map(account => (
              <tr key={account.accountId}>
                <td>{account.accountId}</td>
                <td>{account.roleId}</td>
                <td>{account.firstName}</td>
                <td>{account.lastName}</td>
                <td>{account.email}</td>
                <td>{account.createAt}</td>
                <td>{account.province}</td>
                {/* <td><img src={account.avatar} alt="Avatar" width="50" height="50" /></td> */}
                <td>
                  <button className="btn btn-info" onClick={() => updateAccount(account.accountId)}>Update</button>
                  <button className="btn btn-danger" onClick={() => removeAccount(account.accountId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No Employees Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListEmployeeComponent;
