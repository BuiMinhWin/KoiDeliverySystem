  import React, { useState, useEffect } from 'react';
  import { Line } from 'react-chartjs-2';
  import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler  } from 'chart.js';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import './DeliveryStaff.css';
  import { useNavigate } from 'react-router-dom';
  import { listOrder,getOrderDetail } from '../../services/DeliveryService';
  import { logout } from '../Member/auth'; 
  import { FaSearch } from "react-icons/fa";
  import { FaRegCalendarAlt } from "react-icons/fa";
  import { FiHome } from "react-icons/fi";
  import { IoSettingsOutline } from "react-icons/io5";
  import { MdSupportAgent} from "react-icons/md";
  import { IoIosNotificationsOutline } from "react-icons/io";
  import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
  import { FaRegMessage } from "react-icons/fa6";
  import { CgProfile } from "react-icons/cg";
  import { CiLogout } from "react-icons/ci";
  import { FaTruckFast } from "react-icons/fa6";
  import { FiAlertTriangle } from "react-icons/fi";
  import { FaRegRectangleList } from "react-icons/fa6";
  import { FaBoxesStacked } from "react-icons/fa6";
  
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler );

  
  const DeliveryComponent = () => {
    const handleLogout = () => {
      logout(); 
      navigate('/'); 
    };

    
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  }

    const handleViewOrder = (orderId) => {
      navigate(`/order/${orderId}`);
    };
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    // const [hoveredOrder, setHoveredOrder] = useState(null); 
    const [searchQuery, setSearchQuery] = useState('');
    const [orderDetail, setOrderDetail] = useState(null);

    // const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [monthFilter, setMonthFilter] = useState('');
    const [provinceFilter, setProvinceFilter] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [transportationFilter, setTransportationFilter] = useState('');

    const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
    const ordersPerPage = 10; 
  
    const [isDropdownOpen, setDropdownOpen] = useState(true); //drop down

    const accountId = localStorage.getItem("accountId");
        console.log("accountId:", accountId);
  
    
    const getOrderCounts = () => {
      const totalOrders = orders.length;
      const delivering = orders.filter(order => order.status >= 1 && order.status <= 3).length;
      const approving = orders.filter(order => order.status === 0).length;
      const fail = orders.filter(order => order.status === 4).length;
    
      return {
        totalOrders,
        delivering,
        approving,
        fail,
      };
    };

    const { totalOrders, delivering, approving, fail } = getOrderCounts();
    
    const GHN_API_KEY=import.meta.env.VITE_GHN_API_KEY;
    useEffect(() => {
      
      const fetchProvinces = async () => {
        try {
          const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Token': GHN_API_KEY,
            },
          });
          const data = await response.json();
          // console.log(data); 
          setProvinces(data.data); 
        } catch (error) {
          console.error('Error fetching provinces:', error);
        }
      };
  
      fetchProvinces();
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
    
    // const handleMouseEnter = (order) => {
    //   setHoveredOrder(order); 
    // };

    // const handleMouseLeave = () => {
    //   setHoveredOrder(null); 
    // };

    const handleSearch = async (event) => {
      const orderId = event.target.value;
      setSearchQuery(orderId);
    
      if (orderId) {
        try {
          
          const response = await getOrderDetail(orderId);
          
          if (response.data) {
            setOrderDetail(response.data);  
          } else {
            setOrderDetail(null);  
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
          setOrderDetail(null);  
        }
      } else {
        setOrderDetail(null);  
      }
    };

    // const getStatusCounts = () => {
    //   const statusCounts = orders.reduce((acc, order) => {
    //     const status = order.status;
    //     if (!acc[status]) {
    //       acc[status] = 0;
    //     }
    //     acc[status]++;
    //     return acc;
    //   }, {});

    
    //   return [
    //     // statusCounts[0] || 0,
    //     statusCounts[1] || 0,
    //     statusCounts[2] || 0,
    //     statusCounts[3] || 0,
    //     statusCounts[4] || 0,
    //     // statusCounts[5] || 0,
    //   ];
    // };
    
    // const ordersByStatusChartData = {
    //   labels: ['Status 1', 'Status 2', 'Status 3', 'Status 4'], 
    //   datasets: [
    //     {
    //       label: 'Number of Orders by Status', 
    //       data: getStatusCounts(), 
    //       backgroundColor: 'rgba(75, 192, 192, 0.2)', 
    //       borderColor: 'rgba(75, 192, 192, 1)', 
    //       borderWidth: 2, 
    //       fill: true, 
    //     },
    //   ],
    // };
    // const chartOptions = {
    //   scales: {
    //     y: {
    //       ticks: {
    //         stepSize: 1,
    //         beginAtZero: true,
    //       },
    //       min: 0,
    //       max: Math.max(...getStatusCounts()) + 1, // Dynamically adjust max
    //     },
    //   },
    // };

    // const handleFilterChange = () => {
    //   getAllOrders();  
    // };
   
    const filteredOrders = orders.filter(order => {
      const orderMonth = new Date(order.orderDate).getMonth() + 1;
      const matchesMonth = monthFilter ? orderMonth === parseInt(monthFilter) : true;
      const matchesProvince = provinceFilter ? order.destination.includes(provinceFilter) : true;
      const matchesStatus = statusFilter ? order.status === parseInt(statusFilter) : true;
      const matchesTransportation = transportationFilter ? order.orderNote === transportationFilter : true;
  
      return matchesMonth && matchesProvince && matchesStatus && matchesTransportation;
    });
  
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
      <div className="container-fluid">
        <div className="row">
          <aside className="sidebar col- p-3 ">
            <div className='side-bar'>
            <div className="profile-container text-center mb-4">
              <div className="SideKoi d-flex align-items-center justify-content-between">
                <img src="/Logo-Koi/Order.png" alt="Profile "className="profile-img rounded-circle " />
                <div className=" KoiLogo">
                  <p className="KoiDeli ">Koi Deli</p>
                </div>
              </div>
              {/* <hr className="logo-separator" />  */}
              {/* border */}
              
            </div>
            <nav>
        <ul className="list-unstyled">

          {/* <li>
            <a href="#"><i className="bi bi-speedometer2 me-2"></i> Dashboard</a>
            
          </li> */}
          
            <li>
              <a href="/"><i className="bi bi-speedometer2 me-2"> <FiHome /> </i>  Homepage</a>
          </li>

          

          <li>
            <a href="/orders"><i className="bi bi-person-badge me-2"><HiOutlineClipboardDocumentList /></i> Orders</a>
          </li>

          <li>
            <a href="#"><i className="bi bi-chat-dots me-2"><FaRegCalendarAlt /></i> Calendar</a>
           </li>

          <li>
            <a href="#"><i className="bi bi-life-preserver me-2"><MdSupportAgent /></i> Help & Support</a>
          </li>

          <li>
            <a href="#"><i className="bi bi-chat-dots me-2"> <FaRegMessage/> </i>  Messages</a>
          </li>

          <li>
            <a href="#"><i className="bi bi-gear me-2"><IoSettingsOutline /></i> Settings</a>
           </li>
         
        </ul>
        </nav>
        </div>
          </aside>

          <main className="dashboard ">
          <header className="d-flex justify-content-between align-items-center mb-4 border-bottom ">
              <h1>Delivery Orders</h1> 
              {/* <h6>Delivery Orders</h6>          */}
              <header className="d-flex justify-content-between align-items-center mb-4 ">
              <div className="header-content" style={{ width: '%' }}> 
              <div className="d-flex align-items-center justify-content-center search-container">
              <input
                  className="search-bar"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search Order"
              />
             </div>

                <div className="navbar-cus-right">
                  <div className="dropdown" onClick={toggleDropdown}>
                    <img src="/Delivery/User.png" alt="Avatar" className="avatar" />
                    {isDropdownOpen && ( 
                      <div className="dropdown-content">
                        <a  href="user-page"><CgProfile /> View Profile</a>
                        <a  onClick={handleLogout}><CiLogout /> Logout</a>
                      </div>
                    )}
                  </div>
                </div>
              

              </div>

              <div className="notification-icon m-4">
                  <IoIosNotificationsOutline />
                  {/* <span className="notification-text">somethinghere</span> */}
                </div>
            </header>

            </header>
               
            <section className="delivery-overview">
              <div className="card delivery-total-orders">
                <h3>Total Orders <FaBoxesStacked /></h3>
                
                <p>{totalOrders}</p>
              </div>

              <div className="card delivery-delivering">
                <h3>Delivering  <FaTruckFast /> </h3>
                
                <p>{delivering}</p>
              </div>

              <div className="card delivery-approving">
                <h3>Approving <FaRegRectangleList /> </h3>
                
                <p>{approving}</p>
              </div>
                
              <div className="card delivery-fail">
                <h3>Delivery Issue <FiAlertTriangle /></h3>
                <p>{fail}</p>
              </div>
            </section>

            {orderDetail && orderDetail.length > 0 && (
            <section className="filtered-order mt-4">
              <h2>Order Details for ID: {orderDetail[0].orderId}</h2>
              
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Order Detail ID</th>
                    <th>Koi Name</th>
                    <th>Koi Type</th>
                    <th>Quantity</th>
                    <th>Weight</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th>Created At</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {orderDetail.map((detail) => (
                    <tr key={detail.orderDetailId}>
                      <td>{detail.orderDetailId}</td>
                      <td>{detail.koiName}</td>
                      <td>{detail.koiType}</td>
                      <td>{detail.quantity}</td>
                      <td>{detail.weight}</td>
                      <td>{detail.discount}</td>
                      <td>{detail.status === 1 ? 'Active' : 'Inactive'}</td>
                      <td>{new Date(detail.createdAt).toLocaleString()}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
  )}

            <section className="delivery-ongoing-delivery mt-4 d-flex border-top pt-3">
            <div className="delivery-list col-12 " >
                <h2>Delivery Report</h2>

                <div className="filter-bar d-flex mb-3">
                  <select className="form-select me-2" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                    <option value="">All Months</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                
                  <select className="form-select me-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="0">Waiting for approval</option>
                    <option value="1">In Progress</option>
                    <option value="2">Delivering</option>
                    <option value="3">Delivered</option>
                   
                  </select>
                  <select className="form-select me-2" value={transportationFilter} onChange={(e) => setTransportationFilter(e.target.value)}>
                    {/* <option value="">All Transport</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="car">Car</option>
                     */}
                    <option value= "">Method Transport</option>
                    <option value= "Giao hàng khẩn cấp">Express Delivery</option>
                    <option value= "Giao hàng tiêu chuẩn">Regular Delivery</option>
                  </select>

                  
                  <select className="form-select me-2" value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)}>
                  <option value="">All Provinces</option>
                  {provinces?.map((province) => (
                    <option key={province.ProvinceID} value={province.ProvinceName}>
                      {province.ProvinceName}
                    </option>
                  ))}
                </select>
                </div>
                
                <table className="table table-striped table-bordered ">
                  <thead>
                    <tr>
                    <th>OrderId</th>
                    <th>OrderDate</th>
                    <th>Destination</th>
                    <th>ShipDate</th>
                    <th>Province</th>
                    <th>Origin</th>
                    <th>Freight</th>
                    <th>Status</th>
                    <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders
                    .filter(order => order.deliver ===accountId) 
                    .map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>{order.destination}</td>
                        <td>{new Date(order.shippedDate).toLocaleDateString() }</td>
                        <td>{order.province}</td>
                        <td>{order.origin}</td>
                        <td>{order.freight}</td>
                        <td>{order.status}</td>
                        <td>
                          <button onClick={() => handleViewOrder(order.orderId)}>View</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center">No Orders Found</td>
                    </tr>
                  )}
                </tbody>
                </table>

                <nav>
                <ul className="pagination">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <li key={index} className="page-item">
                    <button onClick={() => paginate(index + 1)} className="page-link">
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
              </nav>

              </div>
            
            </section>

            {/* <section className="statistics mt-4 d-flex justify-content-between border-top pt-3">
              
              <div className="container">
                <h2>Orders by Status</h2>
                <Line data={ordersByStatusChartData} options={chartOptions} />
              </div>
            </section> */}
          </main>
        </div>
      </div>
    );
  };

  export default DeliveryComponent;
