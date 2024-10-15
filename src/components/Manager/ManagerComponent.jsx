import React, { useState, useEffect } from 'react';
import { Line,Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler  } from 'chart.js';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Manager.css';
import { FiHome } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { FiUsers } from "react-icons/fi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";
import { MdSupportAgent } from "react-icons/md";  
import { logout } from '../Member/auth'; 
import { useNavigate } from 'react-router-dom';
// import ProfileComponent from '../Member/ProfileComponent';
import { listOrder } from '../../services/DeliveryService';
import { listAccount } from '../../services/EmployeeService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler );
const ManagerComponent = () => {
  const [orders, setOrders] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await listOrder();
        const totalOrders = ordersResponse.data.length; 

        const accountsResponse = await listAccount();
        const accounts = accountsResponse.data;  

        const totalCustomers = accounts.filter(account => account.roleId === 'Customer').length;
        const totalEmployees = accounts.filter(account => ['Sales', 'Delivery'].includes(account.roleId)).length;

        setStats({
          totalCustomers,
          totalEmployees,
          totalOrders,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    getAllOrders();
  }, []);

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

 
  // const {totalUsers, totalCustomers,totalOrders, totalRevenue} = getOrderCounts();
  // useEffect(() => {
  //   const fetchOverviewData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8080/api/overview'); 
  //       const data = await response.json();
  //       setOverviewData(data);
  //     } catch (error) {
  //       console.error('Error fetching overview data:', error);
  //     }
  //   };

  //   const fetchDeliveries = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8080/api/delivery'); 
  //       const data = await response.json();
  //       setDeliveries(data);
  //       setSelectedDelivery(data[0]); 
  //     } catch (error) {
  //       console.error('Error fetching deliveries:', error);
  //     }
  //   };

  //   fetchOverviewData();
  //   fetchDeliveries();
  // }, []);

  // const fetchOrderDetails = async (orderId) => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/orders/${orderId}`); 
  //     const data = await response.json();
     
  //     updateChartData(data);
  //   } catch (error) {
  //     console.error('Error fetching order details:', error);
  //   }
  // };

  // const handleDeliveryClick = (delivery) => {
  //   setSelectedDelivery(delivery);
  //   fetchOrderDetails(delivery.orderId); 
  // };

  const getStatusCounts = () => {
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status;
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    }, {});

  
    return [
      // statusCounts[0] || 0,
      statusCounts[1] || 0,
      statusCounts[2] || 0,
      statusCounts[3] || 0,
      statusCounts[4] || 0,
      // statusCounts[5] || 0,
    ];
  };
  const ordersByStatusChartData = {
    labels: ['Status 1', 'Status 2', 'Status 3', 'Status 4'], 
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
        max: 6, 
      },
    },
  };
  const ordersByStatusPieData = {
    labels: ['Status 1', 'Status 2', 'Status 3', 'Status 4'],
    datasets: [
      {
        label: 'Orders by Status',
        data: getStatusCounts(),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container-fluid">
      <div className="row">
         <aside className="sidebar col-2 p-3 border-end">
          <div className="profile-container text-center mb-4">
            <div className="SideKoi d-flex align-items-center justify-content-between">
              <img src="/Logo-Koi/Order.png" alt="Profile " className="profile-img rounded-circle me-3" />
              <div className="text-start KoiLogo">
                <p className="KoiDeli mb-0">Koi Deli</p>
              </div>
            </div>
            <hr className="logo-separator" />
            
          </div>
          <nav>
      <ul className="list-unstyled">
        <div>
          <h6>Main</h6>
          <li>
          <a href="/"><i className="bi bi-speedometer2 me-2"> <FiHome /> </i>  Homepage</a>
          </li>

          <li>
            <a href="user-page"><i className="bi bi-speedometer2 me-2"> <CgProfile /> </i> Profile</a>
          </li>
         
        </div>

        <div>
          <h6>List</h6>
          <li>
            <a  href="/listcustomers"><i className="bi bi-people me-2"><FiUsers /></i> Customers</a>
          </li>

          <li>
            <a href="/accounts"><i className="bi bi-person-badge me-2"><FiUsers /></i> Employees</a>
          </li>

          <li>
            <a href="/accounts"><i className="bi bi-person-badge me-2"><HiOutlineClipboardDocumentList /></i> Orders</a>
          </li>

        </div>

        <div>
          <h6>General</h6>

          <li>
            <a href="#"><i className="bi bi-chat-dots me-2"><FaRegCalendarAlt /></i> Calendar</a>
           </li>

          <li>
            <a href="#"><i className="bi bi-chat-dots me-2"><MdOutlineMessage /></i> Notification</a>
           </li>

        </div>

        <div>
        <h6>Maintenance</h6>
        <li>
          <a href="#"><i className="bi bi-life-preserver me-2"><MdSupportAgent /></i> Help & Support</a>
        </li>
        <li>
          <a href="#"><i className="bi bi-gear me-2"><IoSettingsOutline /></i> Settings</a>
        </li>

        </div>
      
      </ul>
    </nav>

        </aside>

        <main className="dashboard col-10 p-4">
        <header className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h1>Admin page</h1>
            
            <header className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <div className="d-flex align-items-center search-container" style={{ flex: 1 }}>
              <input type="text" className="form-control me-2" placeholder="Search..." style={{ width: '100%' }} />
            </div>
            <div className="d-flex align-items-center">
              {/* <select className="form-select me-2">
                <option>ENG</option>
                <option>FR</option>
                <option>ES</option>
              </select> */}
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="profile-dropdown">
                  <img src="/Delivery/User.png" alt="Profile" className="profile-img rounded-circle" style={{ width: '40px', height: '40px' }} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="user-page">View Profile</Dropdown.Item>
                  <Dropdown.Item href="#">Update Profile</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </header>
          </header>

          <section className="overview">
            <div className="card total-shipments">
              <h3>Total Employee</h3>
              <p>{stats.totalEmployees}</p>
              
             
            </div>
            <div className="card total-orders">
              <h3>Total Customers</h3>
              <p>{stats.totalCustomers}</p>
              
            </div>
            <div className="card total-shipments">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders}</p>
              
             
            </div>
            <div className="card delivered">
              <h3>Total Revenue</h3>
              <p>Not available yet</p> 
            </div>
          </section>

          <section className="ongoing-delivery mt-4 d-flex border-top pt-3">
            <div className="delivery-list col-6">
              <h2>Top Delivery Staff</h2>
           
            </div>
            <div className="delivery-map col-6">
            <h2>Top Sales Staff</h2>
              
            </div>
          </section>

          <section className="statistics mt-4 d-flex justify-content-between border-top pt-3">
            <div className="container">
              <h2>Orders by Status</h2>
              {orders.length > 0 ? (
                <Line data={ordersByStatusChartData} options={chartOptions} />
              ) : (
                <p>No order</p>  
              )}
            </div>
            <div className="profits bg-light rounded p-1 shadow">
              <h3>Profits Earned</h3>
              {orders.length > 0 ? (
                <Pie data={ordersByStatusPieData} />
              ) : (
                <p>Wait for calculate</p>
              )}
            </div>

          </section>
          
        </main>
      </div>
    </div>
  );
};

export default ManagerComponent;
