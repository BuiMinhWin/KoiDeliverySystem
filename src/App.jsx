import { useState, useEffect } from 'react';
import './App.css';
import ListEmployeeComponent from './components/Manager/ListEmployeeComponent';
import FooterComponent from './components/Footer/FooterComponent';
import HeaderComponent from './components/Header/HeaderComponent';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeComponent from './components/Manager/EmployeeComponent';
import LoginComponent from './components/Member/LoginComponent';
import RegisterComponent from './components/Member/RegisterComponent'; 
import DeliveryComponent from './components/DeliveryStaff/DeliveryComponent';
import RouteComponent from './routes';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log('Token from localStorage:', token);
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) {
      localStorage.setItem('token', 'your-token'); 
    } else {
      localStorage.removeItem('token'); 
    }
  };

  // return (
  //   <div className='page-container' id="app-container">
  //     <BrowserRouter>
  //       <div className='header'><HeaderComponent /></div>
  //       <div >
  //         <Routes>
  //           <Route path="/" element={<Navigate to="/login" />} />
  //           <Route path='/login' element={<LoginComponent handleLogin={handleLogin} />} />
  //           <Route path='/customer' element={isAuthenticated ? <DeliveryComponent /> : <Navigate to='/login' />} />
  //           <Route path='/delivery' element={isAuthenticated ? <DeliveryComponent /> : <Navigate to='/login' />} />
  //           <Route path="/register" element={<RegisterComponent />} />
  //           <Route path='/accounts' element={isAuthenticated ? <ListEmployeeComponent /> : <Navigate to='/login' />} />
  //           <Route path='/add-account' element={isAuthenticated ? <EmployeeComponent /> : <Navigate to='/login' />} />
  //           <Route path='/edit-account/:accountId' element={isAuthenticated ? <EmployeeComponent /> : <Navigate to='/login' />} />
  //         </Routes>
  //       </div>
  //       <div className='footer'><FooterComponent /></div>
  //     </BrowserRouter>
  //   </div>
  // );
  return(
    <BrowserRouter>
      <RouteComponent/>
    </BrowserRouter>
  );

 
}

export default App;
