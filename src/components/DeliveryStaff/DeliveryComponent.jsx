import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DeliveryStaff.css';
import { useNavigate } from 'react-router-dom';
import { listOrder, getOrderDetail, updateStatus } from '../../services/DeliveryService';
import { logout } from '../Member/auth'; 
import { FaRegCalendarAlt,FaDirections } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdSupportAgent,MdOutlineReportProblem,MdRemoveRedEye} from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { FiAlertTriangle,FiHome  } from "react-icons/fi";
import { FaRegRectangleList,FaBoxesStacked,FaRegMessage,FaTruckFast  } from "react-icons/fa6";
import {  getAvatar} from "../../services/CustomerService";
import { trackingOrderState } from '../../services/DeliveryStatusService';
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

  const [isDropdownOpen, setDropdownOpen] = useState(true); //drop down
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = (orderId) => {
    setIsDisabled(true);
    updateOrderStatus(orderId);
    
    // Đặt lại trạng thái sau 5 giây
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  };


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

    // const getAllOrders = () => {
    //   listOrder()
    //     .then((response) => {
    //       if (Array.isArray(response.data)) {
    //         setOrders(response.data);
    //         const filteredOrders = response.data.filter(order => order.deliver === accountId);
    //         localStorage.setItem("orders", JSON.stringify(filteredOrders));
    //         console.log("Orders from localStorage:", JSON.parse(localStorage.getItem("orders")));
    //       } else {
    //         console.error("API response is not an array", response.data);
    //         setOrders([]);
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching : ", error);
    //     });
    // };
    

    fetchProvinces();
    getAllOrders();
  }, []);

  const getAllOrders = () => {
    listOrder()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
          const filteredOrders = response.data.filter(order => order.deliver === accountId);
          localStorage.setItem("orders", JSON.stringify(filteredOrders));
          console.log("Orders from localStorage:", JSON.parse(localStorage.getItem("orders")));
        } else {
          console.error("API response is not an array", response.data);
          setOrders([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching : ", error);
      });
  };
  

  useEffect(() => {
    const storedOrders1 = JSON.parse(localStorage.getItem("orders")) || [];
    const accountId = localStorage.getItem("accountId");
  
    const checkForNewOrders = async () => {
      try {
        const response = await listOrder(); 
        const newOrders = response.data || [];
  
 
        const filteredNewOrders = newOrders.filter(order => order.deliver === accountId);
        
     
        const newOrderCount = filteredNewOrders.length;
        const storedOrderCount = storedOrders1.length;
  
        // if (newOrderCount > storedOrderCount) {
        //   enqueueSnackbar(`Có ${newOrderCount - storedOrderCount} đơn hàng mới!`, { variant: "info" });
        // }
  
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    const intervalId = setInterval(checkForNewOrders, 5000);

    
    return () => clearInterval(intervalId);
  }, []);


 


  const handleSearch = async (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const API_KEY =import.meta.env.VITE_GOONG_API_KEY; // Thay bằng API Key của bạn

  const reverseGeocodeAddress = async (lat, long) => {
    try {
      const response = await axios.get(
        `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=${API_KEY}`
      );
      const data = response.data;
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address; 
        return address; 
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
    console.log(destination);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const currentLocate = await reverseGeocodeAddress(latitude, longitude);
          setSelectedOrigin(currentLocate);
          setSelectedDestination(destination);
          setShowMap(true);
      }, () => {
        enqueueSnackbar("Không thể lấy vị trí hiện tại.", { variant: "error", autoHideDuration: 1000 });
      });
    } else {
      enqueueSnackbar("Không thể lấy vị trí hiện tại.", { variant: "error", autoHideDuration: 1000 });
    }
  };
 
  const filteredOrders = orders.filter(order => {
    const orderMonth = new Date(order.orderDate).getMonth() + 1;
    const matchesMonth = monthFilter ? orderMonth === parseInt(monthFilter) : true;
    const matchesProvince = provinceFilter ? order.destination.includes(provinceFilter) : true;
    const matchesStatus = statusFilter ? order.status === parseInt(statusFilter) : true;
    const matchesTransportation = transportationFilter ? order.orderNote === transportationFilter : true;

    return matchesMonth && matchesProvince && matchesStatus && matchesTransportation;
})
.filter(order => 
  (order.orderId && order.orderId.toString().toLowerCase().includes(searchQuery)) ||
  (order.customerName && order.customerName.toLowerCase().includes(searchQuery)) ||
  (order.destination && order.destination.toLowerCase().includes(searchQuery))
);




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
            enqueueSnackbar(error, { variant: "error", autoHideDuration: 1000 });
          }
        }, () => {
          enqueueSnackbar("Không thể lấy vị trí hiện tại.", { variant: "error", autoHideDuration: 1000 });
        });
      } else {
        alert("Geolocation fail.");
      }
    }
  };

  const updateOrderSpecial = async (orderId) => {

    let newStatus = 6;
    console.log(newStatus);
    
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
        
          <li>
            <a href="/"><i className="bi bi-speedometer2 me-2"> <FiHome /> </i>  Homepage</a>
        </li>
        
        <li>
          <a href="/orders"><i className="bi bi-person-badge me-2"><HiOutlineClipboardDocumentList /></i>Lịch sử đơn hàng</a>
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

        <main className="dashboard col-10">
        <header className="d-flex justify-content-between align-items-center mb-4 border-bottom ">
            <h4 className="title">Báo cáo vận chuyển</h4> 
         
            <header className="d-flex justify-content-between align-items-center mb-4" style={{ marginRight: '50px' }}>
            <div className="header-content" style={{ width: '%' }}> 
            <div className="d-flex align-items-center justify-content-center search-container">
            <input
              className="search-bar"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Tìm kiếm đơn hàng"
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
            

            </div>

            <div className="notification-icon m-4">
                <IoIosNotificationsOutline />
                {/* <span className="notification-text">somethinghere</span> */}
              </div>
          </header>

          </header>
             
          <section className="delivery-overview">
            <div className="card delivery-total-orders">
              <h3>Tổng số đơn <FaBoxesStacked /></h3>
              
              <p>{totalOrders}</p>
            </div>

            <div className="card delivery-delivering">
              <h3>Đang giao  <FaTruckFast /> </h3>
              
              <p>{delivering}</p>
            </div>

            <div className="card delivery-approving">
              <h3>Đang lấy hàng <FaRegRectangleList /> </h3>
              
              <p>{approving}</p>
            </div>
              
            <div className="card delivery-fail">
              <h3>Đơn sự cố <FiAlertTriangle /></h3>
              <p>{fail}</p>
            </div>
          </section>

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
                  <option value="12">Tháng 11</option>
                </select>
              
                <select className="form-select me-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Trạng thái</option>
                  <option value="2">Chờ lấy hàng</option>
                  <option value="3">Đã lấy hàng</option>
                  <option value="4">Đang giao</option>
                  
                 
                </select>
                <select className="form-select me-2" value={transportationFilter} onChange={(e) => setTransportationFilter(e.target.value)}>
            
                  <option value= "">Phương thức vận chuyển</option>
                  <option value= "Giao hàng khẩn cấp">Giao hàng khẩn cấp</option>
                  <option value= "Giao hàng tiêu chuẩn">Giao hàng tiêu chuẩn</option>
                </select>

                
                
                <select className="form-select me-2" value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)}>
                <option value="">Tỉnh thành</option>
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
                  <th>Điểm đi</th>
                  <th>Điểm đến</th>
                  <th>Dịch vụ</th>
                  <th>Cập nhật</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders
                    .filter((order) => order.deliver === accountId && order.status > 1 && order.status < 5)
                    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                    .map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.origin}</td>
                        <td>{order.destination}</td>
                        <td>{order.freight}</td>
                        <td>
                          <button className="btn btn-info" onClick={() => handleClick(order.orderId)} disabled={isDisabled}>
                            {order.status === 2 && "Đang lấy hàng"}
                            {order.status === 3 && "Đã lấy hàng"}
                            {order.status === 4 && "Đang giao"}
                            {order.status === 5 && "Đã hoàn thành"}
                            {order.status === 6 && "Đơn sự cố"}
                          </button>
                        </td>
                        <td>
                          <button className="btn btn-primary me-2" onClick={() => handleViewOrder(order.orderId)}>
                            <MdRemoveRedEye />
                          </button>

                          <button className="btn btn-primary me-2" onClick={() => handleDirection(order.destination)}>
                            <FaDirections />
                          </button>

                          <button className="btn btn-primary" onClick={() => updateOrderSpecial(order.orderId)}>
                            <MdOutlineReportProblem />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">Chưa có đơn nào</td>
                  </tr>
                )}
              </tbody>
            </table>
            {showMap && (
              <Map origin={selectedOrigin} destination={selectedDestination} />
            )}


         
            </div>
          
          </section>
        </main>
      </div>
    </div>
  );
};

export default DeliveryComponent;
