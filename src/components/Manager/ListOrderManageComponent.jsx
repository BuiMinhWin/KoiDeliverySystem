import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListOrderManage.css';
import { useNavigate } from 'react-router-dom';
import { listOrder, getOrderDetail, updateStatus } from '../../services/DeliveryService';
import { logout } from '../Member/auth'; 
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiHome ,FiUsers } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { MdSupportAgent} from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaRegMessage } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { getAvatar} from "../../services/CustomerService";
import { trackingOrderState } from '../../services/DeliveryStatusService';
import { useSnackbar } from 'notistack';
import axios from "axios";

const ListOrderManageComponent = () => {
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

    let newStatus = 4;
   
    if (newStatus) {
      updateStatus(orderId, newStatus);
    
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const currentLocate = await reverseGeocodeAddress(latitude, longitude);
            const trackingData = { orderId, currentLocate, status: newStatus };
            const response = await trackingOrderState(trackingData);
            const result = response?.data;
    
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
        <aside className="sidebar col-2 p-3 ">
          <div className='manager-sidebar'>
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
        <h6>Main</h6>
        <li>
            <a href="/"><i className="bi bi-speedometer2 me-2"> <FiHome /> </i>  Homepage</a>
        </li>

        
        <h6>List</h6>
        <li>
          <a href="/manager"><i className="bi bi-person-badge me-2"><HiOutlineClipboardDocumentList /></i>Dashboard</a> 
        </li>

        <li>
          <a  href="/listcustomers"><i className="bi bi-people me-2"><FiUsers /></i>Danh sách khách hàng</a>
        </li>

        <li>
          <a href="/accounts"><i className="bi bi-person-badge me-2"><FiUsers /></i>Dach sách nhân viên</a>
        </li>


        
         <li>
            <a href="/service"><i className="bi bi-person-badge me-2"><HiOutlineClipboardDocumentList /></i> Danh sách dịch vụ</a>
          </li>

          <li>
          <a href="employee-page"><i className="bi bi-person-badge me-2"><CgProfile /></i>Thông tin tài khoản</a>
        </li>

        <li>
          <a onClick={handleLogout}><i className="bi bi-person-badge me-2"><CiLogout /></i>Đăng xuất</a>
        </li>

        
       
      </ul>
      </nav>
      </div>
        </aside>

        <main className="dashboard col-10 ">
        <header className="d-flex justify-content-between align-items-center mb-4 ">
        <h4 className="title">Dashboard</h4>
        <header className="d-flex justify-content-between align-items-center mb-4" style={{ marginRight: '50px' }}>
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

          <section className="delivery-ongoing-delivery mt-4 d-flex border-top pt-3">
          <div className="delivery-list col-12 " >

              <div className="filter-bar d-flex mb-3">
                <select className="form-select me-2" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                  <option value="">Tháng</option>
                  <option value="1">Tháng 1</option>
                  <option value="2">Tháng 2</option>
                  <option value="3">Tháng 3</option>
                  <option value="4">Tháng 4</option>
                  <option value="5">Tháng 5</option>
                  <option value="6">Tháng 6</option>
                  <option value="7">Tháng 7</option>
                  <option value="8">Tháng 8</option>
                  <option value="9">Tháng 9</option>
                  <option value="10">Tháng 10</option>
                  <option value="11">Tháng 11</option>
                  <option value="12">Tháng 12</option>
                </select>
              
                <select className="form-select me-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Trạng thái</option>
                  <option value="0">Chờ Duyệt</option>
                  <option value="1">Đã duyệt</option>
                  <option value="2">Chờ thanh toán</option>
                  <option value="3">Đang lấy hàng</option>
                  <option value="4">Đang giao</option>
                  <option value="5">Đã giao</option>
                  <option value="6">Đơn sự cố</option>
                  
                 
                </select>
                <select className="form-select me-2" value={transportationFilter} onChange={(e) => setTransportationFilter(e.target.value)}>
             
                  <option value= "">Phương thức vận chuyển</option>
                  <option value= "Giao hàng khẩn cấp">Giao hàng khẩn cấp</option>
                  <option value= "Giao hàng tiêu chuẩn">Giao hàng tiêu chuẩn</option>
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
                  <th>Điểm đi</th>
                  <th>Ngày đặt</th>
                  <th>Điểm đến</th>
                  <th>Ngày giao</th>
                  <th>Phương thức vận chuyển</th>
                  <th>Trạng thái</th>
                  <th> </th>
                  </tr>
                </thead>
                <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders
                  
                  .map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.origin}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>{order.destination}</td>
                      <td>
                      {order.shippedDate && order.status !== 0 && order.status !==6 ? new Date(order.shippedDate).toLocaleDateString() : 
                      (order.status === 6 && "Đơn khẩn")}
                      </td>
                      <td>{order.freight}</td>
                      <td>
                        {order.status === 2 && "Đang duyệt"}
                        {order.status === 3 && "Đã lấy hàng"}
                        {order.status === 4 && "Đang giao"}
                        {order.status === 5 && "Đã hoàn thành"}  
                        {order.status === 6 ? (
                            <button onClick={() => updateOrderStatus(order.orderId)}>Xử lí</button>
                          ) : null}
                        {order.status === 7 && "Đã hoàn thành"} 
                      </td>
                      <td>
                        <button onClick={() => handleViewOrder(order.orderId)}>Xem</button>
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
        </main>
      </div>
    </div>
  );
};

export default ListOrderManageComponent;
