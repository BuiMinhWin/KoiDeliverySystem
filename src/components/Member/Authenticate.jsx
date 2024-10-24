import React from 'react';
import PropTypes from 'prop-types'; 
import { Navigate } from 'react-router-dom';

const Authenticate = ({ allowedRoles, children }) => {
  const roleId = localStorage.getItem('roleId'); 

  if (!allowedRoles.includes(roleId)) {
    return <Navigate to="/" />; 
  }

  return children; 
};


Authenticate.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, 
  children: PropTypes.node.isRequired, 
};

export default Authenticate;