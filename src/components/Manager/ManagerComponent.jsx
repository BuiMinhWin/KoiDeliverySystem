import React, { useState, useEffect } from 'react';
import { Line,Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler  } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Manager.css';
import { FiHome, FiUsers } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

import { logout } from '../Member/auth'; 
import { useNavigate } from 'react-router-dom';
// import ProfileComponent from '../Member/ProfileComponent';
import { listOrder } from '../../services/DeliveryService';
import { listAccount } from '../../services/EmployeeService';
import { CiLogout } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import {  getAvatar} from "../../services/CustomerService";  

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler );

const ManagerComponent = () => {
  const [orders, setOrders] = useState([]);
  const [avatar, setAvatar] = useState(null); 
  const accountId = localStorage.getItem("accountId");

  const [deliveryOrderCounts, setDeliveryOrderCounts] = useState({});
  const [salesOrderCounts, setSalesOrderCounts] = useState({});

  const [stats, setStats] = useState({
    
    totalCustomers: 0,
    totalEmployees: 0,
    totalOrders: 0,
  });
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };
  const [isDropdownOpen, setDropdownOpen] = useState(true); 
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await listOrder();
        const totalOrders = ordersResponse.data.length; 

        const accountsResponse = await listAccount();
        const accounts = accountsResponse.data;  

        const totalCustomers = accounts.filter(account => account.roleId === 'Customer').length;
        const totalEmployees = accounts.filter(account => ['Sales', 'Delivery'].includes(account.roleId)).length;
        const totalErrors = ordersResponse.data.some(order => order.status === 6) 
        ? ordersResponse.data.filter(order => order.status === 6).length 
        : 0;


        setStats({
          totalCustomers,
          totalEmployees,
          totalOrders,
          totalErrors,
        });

        const deliveryStaff = accounts.filter(account => account.roleId === 'Delivery');
        const salesStaff = accounts.filter(account => account.roleId === 'Sales');
        
        // tính số lượng đơn hàng cho delivery
        const deliveryCounts = {};
        deliveryStaff.forEach((account) => {
          const totalDO = ordersResponse.data.filter(order => order.deliver === account.accountId).length;
          deliveryCounts[account.accountId] = totalDO;
        });
        setDeliveryOrderCounts(deliveryCounts);

        // Tính số lượng đơn hàng cho sales staff
        const salesCounts = {};
        salesStaff.forEach((account) => {
          const totalSO = ordersResponse.data.filter(order => order.sale === account.accountId).length;
          salesCounts[account.accountId] = totalSO;
        });
        setSalesOrderCounts(salesCounts);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchAccount = async () => {
      try {
      
        const avatarUrl = await getAvatar(accountId);
        setAvatar(avatarUrl);
      } catch (error) {
        console.error("Error fetching account data:", error);
      } 
    };

    fetchData();
    getAllOrders();
    if (accountId) fetchAccount();
  }, [accountId]);

  const getAllOrders = () => {
    listOrder()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error("API response is not an array", response.data);
          setOrders([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching : ", error);
      });
  };
  

  const getStatusCounts = () => {
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status;
      if (!acc[status - 1]) {  // Adjust index to match status labels 1-5
        acc[status - 1] = 0;
      }
      acc[status - 1]++;
      return acc;
    }, new Array(5).fill(0));  // Initialize an array with 5 zeroes for statuses 1-5
  
    return statusCounts;
  };

const ordersByStatusChartData = {
      labels: ['Status 1', 'Status 2', 'Status 3', 'Status 4','Status 5'], 
      datasets: [
        {
          label: 'Number of Orders by Status', 
          data: getStatusCounts(), 
          backgroundColor: 'rgba(75, 192, 192, 0.2)', 
          borderColor: 'rgba(75, 192, 192, 1)', 
          borderWidth: 2, 
          fill: true, 
        },
      ],
    };

  const chartOptions = {
    scales: {
          y: {
            ticks: {
              stepSize: 1,
              beginAtZero: true,
            },
            min: 0,
            max: Math.max(...getStatusCounts()) + 1, 
          },
        },
  };
  const ordersByStatusPieData = {
    labels: ['Status 1', 'Status 2', 'Status 3', 'Status 4','Status 5'],
    datasets: [
      {
        label: 'Orders by Status',
        data: getStatusCounts(),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(255, 69, 0, 0.2)',
          'rgba(25, 171, 90, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 69, 0, 1)',
          'rgba(25, 192, 172, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="sidebar col-2 p-3">
          <div className='manager-sidebar'>
          <div className="profile-container text-center mb-4">
            <div className="SideKoi d-flex ">
              <img src="/Logo-Koi/Order.png" alt="Profile " className="profile-img rounded-circle me-3" />
              <div className=" KoiLogo">
                <p className="KoiDeli ">Koi Deli</p>
              </div>
            </div>
          
          </div>
          <nav>
      <ul className="list-unstyled">
         <div>
            <h6>Main</h6>
            <li>
            <a href="/"><i className="bi bi-speedometer2 me-2"> <FiHome /> </i>Trang chủ</a>
            </li>

          </div>

          <div>
            <h6>Quản lí</h6>
            <li>
              <a  href="/listcustomers"><i className="bi bi-people me-2"><FiUsers /></i> Danh sách khách hàng</a>
            </li>

            <li>
            <a href="/accounts">
              <i className="bi bi-person-badge me-2"><FiUsers /></i>Danh sách nhân viên
            </a>
          </li>

            <li>
              <a href="/ordersM"><i className="bi bi-person-badge me-2"><HiOutlineClipboardDocumentList /></i>Lịch sử đơn hàng</a>
            </li>

            <li>
              <a href="/service"><i className="bi bi-person-badge me-2"><HiOutlineClipboardDocumentList /></i>Quản lí dịch vụ</a>
            </li>

         

            <li>
          <a href="employee-page"><i className="bi bi-person-badge me-2"><CgProfile /></i>Thông tin tài khoản</a>
        </li>

        <li>
          <a onClick={handleLogout}><i className="bi bi-person-badge me-2"><CiLogout /></i>Đăng xuất</a>
        </li>

          </div>
     

        </ul>
      </nav>
      </div>
        </aside>

        <main className="dashboard col-10 ">
        <header className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h4 className="title">Dashboard</h4>

            <header className="d-flex justify-content-between align-items-center mb-4" style={{ marginRight: '50px' }}>
            <div className="d-flex align-items-center search-container">
              <input 
              className="form-control me-5"
              type="text"  
              placeholder="Search..." 
              style={{ width: '100%' }} 
              />
            </div>

            <div className="navbar-cus-right">
                  <div className="dropdown" onClick={toggleDropdown}>
                  <img src={avatar || '/default-avatar.png'} alt="Avatar" className="avatar" />
                    {isDropdownOpen && ( 
                      <div className="dropdown-content">
                            <a  href="employee-page"><CgProfile /> Thông tin tài khoản</a>
                          <a  onClick={handleLogout}><CiLogout /> Đăng xuất</a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="notification-icon m-4">
                  <IoIosNotificationsOutline />
                  {/* <span className="notification-text">somethinghere</span> */}
                </div>
              
          </header>
          
          </header>

          <section className="overview">
            <div className="card total-employee">
              <h3>Tổng nhân viên</h3>
              <p>{stats.totalEmployees}</p>
              
            
            </div>
            <div className="card total-customers">
              <h3>Tổng khách hàng</h3>
              <p>{stats.totalCustomers}</p>
              
            </div>
            <div className="card card total-orders">
              <h3>Tổng đơn</h3>
              <p>{stats.totalOrders}</p>
              
            
            </div>
            <div className="card revenue">
              <h3>Đơn sự cố</h3>
              <p>{stats.totalErrors}</p> 
            </div>
          </section>

          <section className="ongoing-employee mt-4 d-flex border-top pt-3">
          <div className="delivery-list col-6">
          <h2>Top Delivery Staff</h2>
          <ul>
            {Object.entries(deliveryOrderCounts)
              .map(([accountId, count]) => ({ accountId, count }))
              .sort((a, b) => b.count - a.count) // Sắp xếp theo count giảm dần
              .slice(0, 10) // Giới hạn 10 người
              .map(({ accountId, count }) => (
                <li key={accountId}>
                  Staff ID: {accountId}, Orders Delivered: {count}
                </li>
              ))}
          </ul>
        </div>
          <div className="sales-list col-6">
            <h2>Top Sales Staff</h2>
            <ul>
            {Object.entries(salesOrderCounts)
              .map(([accountId, count]) => ({ accountId, count }))
              .sort((a, b) => b.count - a.count) // Sắp xếp theo count giảm dần
              .slice(0, 10) // Giới hạn 10 người
              .map(({ accountId, count }) => (
                <li key={accountId}>
                  Staff ID: {accountId}, Orders Delivered: {count}
                </li>
              ))}
          </ul>
          </div>
        </section>

        <section className="statistics mt-4 justify-content-between border-top pt-3">
        <div className="row">
          <div className="chart col-6">
            <h2>Thống kê đơn</h2>
            {orders.length > 0 ? (
              <Line data={ordersByStatusChartData} options={chartOptions} />
            ) : (
              <p>No orders</p>
            )}
          </div>
          <div className="profits col-6">
            <h3>Lợi nhuận</h3>
            {orders.length > 0 ? (
              <Pie data={ordersByStatusPieData} />
            ) : (
              <p>Đang tính toán</p>
            )}
          </div>
        </div>
      </section>
                    
        </main>
      </div>
    </div>
  );
};

export default ManagerComponent;
