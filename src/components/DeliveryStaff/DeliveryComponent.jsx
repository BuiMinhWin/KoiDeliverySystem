import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DeliveryStaff.css';
import { useNavigate } from 'react-router-dom';
import { listOrder, getOrderDetail, updateStatus } from '../../services/DeliveryService';
import { logout } from '../Member/auth'; 
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
import {  getAvatar} from "../../services/CustomerService";
import { trackingOrderState } from '../../services/DeliveryStatusService';
import { MdDirections } from "react-icons/md";
import { useSnackbar } from 'notistack';
import axios from "axios";
import Map from '../Map';

const DeliveryComponent = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
  const [avatar, setAvatar] = useState(null); 

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

  
  const   getOrderCounts = () => {
    const totalOrders = orders.filter(order => order.deliver === accountId ).length;
    const delivering = orders.filter(order => order.status >= 3 && order.status < 5).length;
    const approving = orders.filter(order => order.status === 2).length;
    const fail = orders.filter(order => order.status === 6).length;
  
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
    const fetchAccount = async () => {
      try {
       
        const avatarUrl = await getAvatar(accountId);
        setAvatar(avatarUrl);
      } catch (error) {
        console.error("Error fetching account data:", error);
      } 
    };
 
    if (accountId) fetchAccount();

    

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
  const API_KEY =import.meta.env.VITE_GOONG_API_KEY; // Thay bằng API Key của bạn

  const reverseGeocodeAddress = async (lat, long) => {
    try {
      const response = await axios.get(
        `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=${API_KEY}`
      );
      const data = response.data;
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address; // Get the formatted address
        return address; // Return the full address
      } else {
        throw new Error('No results found for the address.');
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
      throw new Error('Failed to fetch geocode.');
    }
  };

  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [showMap, setShowMap] = useState(false);

  const handleDirection = async ( destination) => {
    navigate('/map', { state: { destination } });
    // console.log(destination);
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(async (position) => {
       
    //       const latitude = position.coords.latitude;
    //       const longitude = position.coords.longitude;
    //       const currentLocate = await reverseGeocodeAddress(latitude, longitude);
    //       setSelectedOrigin(currentLocate);
    //       setSelectedDestination(destination);
    //       setShowMap(true);
    //   }, () => {
    //     enqueueSnackbar("Không thể lấy vị trí hiện tại.", { variant: "error", autoHideDuration: 1000 });
    //   });
    // } else {
    //   enqueueSnackbar("Không thể lấy vị trí hiện tại.", { variant: "error", autoHideDuration: 1000 });
    // }
  };
 
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

  const updateOrderStatus = async (orderId) => {
  
    const currentOrder = orders.find(order => order.orderId === orderId);
    let newStatus = currentOrder.status;
    console.log(newStatus);

    if (newStatus < 5) {
      newStatus += 1;
    } else {
      enqueueSnackbar("Trạng thái không thể tăng thêm nữa!", { variant: "warning", autoHideDuration: 1000 });
      return;
    }
    
    if (newStatus) {
      updateStatus(orderId, newStatus);
      console.log(orderId);
      console.log(newStatus);
    
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const currentLocate = await reverseGeocodeAddress(latitude, longitude);
            const trackingData = { orderId,currentLocate,status: newStatus };
            const response = await trackingOrderState(trackingData);
            const result = response?.data;
            console.log(result);
    
            if (result) {
              enqueueSnackbar("Cập nhật trạng thái thành công", { variant: "success", autoHideDuration: 1000 });
              getAllOrders();
            }
          } catch (error) {
            enqueueSnackbar("Cập nhật thất bại. Vui lòng thử lại.", { variant: "error", autoHideDuration: 1000 });
          }
        }, () => {
          enqueueSnackbar("Không thể lấy vị trí hiện tại.", { variant: "error", autoHideDuration: 1000 });
        });
      } else {
        alert("Geolocation fail.");
      }
    }
  };

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
        
          <li>
            <a href="/"><i className="bi bi-speedometer2 me-2"> <FiHome /> </i>  Homepage</a>
        </li>
        
        <li>
          <a href="/orders"><i className="bi bi-person-badge me-2"><HiOutlineClipboardDocumentList /></i> Ordered</a>
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
                <img src={avatar || '/default-avatar.png'} alt="Avatar" className="avatar" />
                  {isDropdownOpen && ( 
                    <div className="dropdown-content">
                      <a  href="employee-page"><CgProfile /> View Profile</a>
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
              <h3>Picking up <FaRegRectangleList /> </h3>
              
              <p>{approving}</p>
            </div>
              
            <div className="card delivery-fail">
              <h3>Delivery Issue <FiAlertTriangle /></h3>
              <p>{fail}</p>
            </div>
          </section>

          <section className="delivery-ongoing-delivery mt-4 d-flex border-top pt-3">
          <div className="delivery-list col-12">
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
                <option value="3">Waiting for get order</option>
                <option value="4">Delivering</option>
              </select>

              <select className="form-select me-2" value={transportationFilter} onChange={(e) => setTransportationFilter(e.target.value)}>
                <option value="">Method Transport</option>
                <option value="Dịch vụ hỏa tốc">Express Delivery</option>
                <option value="Dịch vụ tiêu chuẩn">Regular Delivery</option>
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

            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>OrderId</th>
                  <th>OrderDate</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Direction</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders
                  .filter(order => order.deliver === accountId && order.status > 1 && order.status < 5)
                  .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) // Sort newest to oldest
                  .map((order) => (
                    <tr key={order.orderId}>
                      <td style={{ color: order.freight === 'Dịch vụ hỏa tốc' ? 'red' : 'inherit' }}>
                        {order.orderId}
                      </td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>{order.origin}</td>
                      <td>{order.destination}</td>
                      <td>
                        {order.status === 2 && "Đang lấy hàng"}
                        {order.status === 3 && "Đã lấy hàng"}
                        {order.status === 4 && "Đang giao"}
                        {order.status === 5 && "Đã hoàn thành"}
                      </td>
                      <td>
                        <button
                          className="btn btn-info"
                          onClick={() => updateOrderStatus(order.orderId)}
                        >
                          Tracking
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleViewOrder(order.orderId)}>View</button>
                      </td>
                      <td>
                      <button
                        className="btn"
                        style={{ backgroundColor: 'transparent', border: 'none', padding: -10 }}
                        onClick={() => handleDirection(order.destination)}
                      >
                        <MdDirections style={{ fontSize: '1.2rem', color: 'black' }} />
                      </button>
                    </td>
                    </tr>
                  ))}
                {currentOrders.length === 0 && (
                  <tr>
                    <td colSpan="12" className="text-center">No Orders Found</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {showMap && <Map origin={selectedOrigin} destination={selectedDestination} />}

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

        </main>
      </div>
    </div>
  );
};

export default DeliveryComponent;
